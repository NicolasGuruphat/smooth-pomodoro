<template ref="app">
  <div class="progress-background-base" :style="progressBackgroundGradiant">
    <StatistiquesBlock class="stats-block" :currentPomodoroNumber="currentPomodoroNumber"
      :pomodoriByCycle="pomodoriByCycle" :totalPomodoriDone="totalPomodoriDone" :goal="goal" :timer="timer">
    </StatistiquesBlock>
    <OptionsBlock class="options-block" v-model:showTodo="showTodo">
    </OptionsBlock>
    <div id="timer-group">
      <ActionButton class="minute-button" id="remove-one-minute-button" :action="removeOneMinute">&#60;</ActionButton>
      <span id="timer"  ref="clock" :class="{ 'working': working, 'not-working': !working , 'blink': blink}">{{ timer }}</span>
      <ActionButton class="minute-button" id="add-one-minute-button" :action="addOneMinute">&#62;</ActionButton>
    </div>
    <div v-if="selectedTask !== null" class="focus-label">Focus on : <span id="selected-task">{{ selectedTask.name }}</span></div>
    <div v-else class="focus-label">Click on a task to focus on it</div>
    <div style="display: flex; justify-content: center; margin-top: 2rem;">
      <div style="display:grid; grid-template-columns: fit-content(40%) fit-content(40%);box-sizing: border-box;">
        <ActionButton id="start-stop-button" :action="startOrStop">{{ startOrStopLabel }}</ActionButton>
        <ActionButton id="skip-button" :action="skipCurrentPomodoro">SKIP</ActionButton>
        <ActionButton id="reset-button" :action="globalReset">RESET</ActionButton>
        <ActionButton id="go-to-first-button" :action="goBackToFirstPomodoro"
          :enabled="currentPomodoroNumber != 1 || !working">➔1<sup>st</sup>
        </ActionButton>
      </div>
    </div>
    <ProgressBar />
    <div ref="todoList" :style="style" style="position: fixed" v-show="showTodo">
      <TodoList v-model:selectedTask="selectedTask" />
    </div>
    <footer>
      <button :style="[isFullscreen ? 'opacity:0.5' : 'opacity:1']" id="fullscreen-button" @click="toggle" style="text-align: left;">
        <img id="fullscreen-logo" :src="fullscreenLogo" alt="fullscreen-logo" />
      </button>
      <div>
        <div>Smooth Pomodoro - by Nicolas Guruphat</div>
        <a href="https://www.flaticon.com/authors/pixel-perfect" title="tomato icons">Tomato icons created by Pixel perfect
          - Flaticon</a>
        <br>
        <a href="https://freesound.org/people/InspectorJ/sounds/411575/">Sound effect by InspectorJ - Freesound</a>
      </div>
      <ActionButton id="clear-data-button" :action="clearData" style="text-align: right;">CLEAR DATA</ActionButton>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useParameters } from '@/store/Parameters'
import ActionButton from './components/ActionButton.vue'
import StatistiquesBlock from './components/StatistiquesBlock.vue'
import OptionsBlock from './components/OptionsBlock.vue'
import ProgressBar from './components/ProgressBar.vue'
import TodoList from './components/TodoList.vue'
import { ref, computed, watchEffect } from 'vue'
import fullscreenLogo from '@/assets/fullscreen.svg'
import { useFullscreen, useFavicon, useDraggable } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useUser } from './store/User'

import type Task from '@/interfaces/Task'
import type TimerReturn from './interfaces/composable/TimerReturn'

function useTimer () : TimerReturn {
  function checkTime (): void {
    if (minutes.value < 0) {
      switchSession()
    }
    if (seconds.value < 0) {
      seconds.value = 59
      minutes.value--
      if (minutes.value < 0) {
        switchSession()
      }
    }
  }
  const clock = ref<HTMLElement | null>(null)
  const intervalId = ref<number | null>(null)
  const startTimer = (): void => {
    intervalId.value = setInterval(() => {
      seconds.value--
    }, 1000)
  }
  const stopTimer = (): void => {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }
  const timer = computed(() => {
    checkTime()
    const minutesToDisplay: string = minutes.value < 10 ? '0' + minutes.value : minutes.value.toString()
    const secondsToDisplay: string = seconds.value < 10 ? '0' + seconds.value : seconds.value.toString()
    return minutesToDisplay + ':' + secondsToDisplay
  })
  function addOneMinute (): void {
    minutes.value++
  }

  function removeOneMinute (): void {
    minutes.value--
  }
  const blinkIntervalId = ref<number | null>(null)
  const blink = ref(true)
  const blinking = ref(true)
  const startBlink = (): void => {
    console.log('here')
    blinking.value = true
    blinkIntervalId.value = setInterval(() => {
      if (clock.value == null) {
        return
      }
      blink.value = !blink.value
    }, 1000)
  }
  const stopBlink = (): void => {
    if (blinkIntervalId.value !== null) {
      clearInterval(blinkIntervalId.value)
      intervalId.value = null

      if (clock.value == null) {
        return
      }
      blink.value = false
      blinking.value = false
    }
  }
  return { clock, timer, blinking, blink, startTimer, stopTimer, addOneMinute, removeOneMinute, startBlink, stopBlink }
}

function useIcon () : void {
  const { blinking } = useTimer()
  const icon = useFavicon()
  icon.value = 'orangeTomato.png'

  function changeIcon (color: string): void {
    switch (color) {
      case 'green':
        icon.value = 'greenTomato.png'
        break
      case 'red':
        icon.value = 'redTomato.png'
        break
      case 'orange':
        icon.value = 'orangeTomato.png'
        break
    }
  }
  watchEffect(() => {
    if (blinking.value) {
      changeIcon('orange')
    } else {
      if (working.value) {
        changeIcon('red')
      } else {
        changeIcon('green')
      }
    }
  })
}

function useReset () : { globalReset: ()=>void; resetTimer: () => void; clearData: () => void} {
  function globalReset (): void {
    resetTimer()
    totalPomodoriDone.value = 0
    currentPomodoroNumber.value = 1
  }

  function resetTimer (): void {
    minutes.value = pomodoroTime.value.minutes
    seconds.value = pomodoroTime.value.seconds
    working.value = true
  }

  const clearData = (): void => {
    if (!confirm("You're about to delete all of your data (except task list).\nAre you sure you want to do that ? 🧹")) {
      return
    }
    parameters.reset()
    user.reset()
  }
  return { globalReset, resetTimer, clearData }
}

const app = ref(null)
const showTodo = ref<boolean>(true)
const selectedTask = ref<Task | null>(null)
const todoList = ref<HTMLElement | null>(null)

useIcon()
const { globalReset, resetTimer, clearData } = useReset()
const { clock, timer, blink, startTimer, stopTimer, addOneMinute, removeOneMinute, startBlink, stopBlink } = useTimer()
const parameters = useParameters()
const user = useUser()
const { isFullscreen, toggle } = useFullscreen(app)
const { style } = useDraggable(todoList, {
  initialValue: { x: 40, y: 40 }
})

const { currentPomodoroNumber, totalPomodoriDone, minutes, seconds } = storeToRefs(user)
const { pomodoroTime, breakTime, audioEnabled, gradiantEnabled, pomodoriByCycle, goal } = storeToRefs(parameters)

startBlink()

const startOrStopLabel = ref<'START' | 'STOP'>('START')
function startOrStop (): void {
  if (startOrStopLabel.value === 'STOP') {
    startOrStopLabel.value = 'START'
    stopTimer()
    startBlink()
  } else {
    startOrStopLabel.value = 'STOP'
    stopBlink()
    startTimer()
  }
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const soundEffect = ref<HTMLMediaElement>(new Audio(require('./assets/gong_hit.wav')))

const working = ref<boolean>(true)
function switchSession (): void {
  if (audioEnabled.value) {
    soundEffect.value.play()
  }
  if (working.value) {
    // switch to pause session
    if (currentPomodoroNumber.value === pomodoriByCycle.value) {
      minutes.value = breakTime.value.big.minutes
      seconds.value = breakTime.value.big.seconds
    } else {
      minutes.value = breakTime.value.small.minutes
      seconds.value = breakTime.value.small.seconds
    }
    totalPomodoriDone.value += 1
  } else {
    // switch to work session
    currentPomodoroNumber.value = (currentPomodoroNumber.value) % pomodoriByCycle.value + 1
    minutes.value = pomodoroTime.value.minutes
    seconds.value = pomodoroTime.value.seconds
  }
  working.value = !working.value
}

const progressBackgroundGradiant = computed(() => {
  if (gradiantEnabled.value) {
    const baseTime: number = working.value ? pomodoroTime.value.minutes * 60 + pomodoroTime.value.seconds : breakTime.value.small.minutes * 60 + breakTime.value.small.seconds * 60
    const currentTime: number = baseTime - (minutes.value * 60 + seconds.value)
    if (working.value) {
      const progression: number = ((currentTime / baseTime) - 1 / 3) * 100 * 3 * -1

      return {
        background: `linear-gradient(75deg, #ffb5aa ${progression}%, #aaffb6 100%)`
      }
    } else {
      const progression: number = ((currentTime / baseTime) - 0.2) * 100 * 5 * -1
      return {
        background: `linear-gradient(-105deg, #aaffb6 ${progression}%, #ffb5aa 100%)`
      }
    }
  } else {
    return { 'background-color': working.value ? '#ffb5aa' : '#aaffb6' }
  }
})

function skipCurrentPomodoro (): void {
  minutes.value = 0
  seconds.value = 0
  seconds.value--
}

function goBackToFirstPomodoro (): void {
  // go back to the first pomodoro of the current cycle
  if (working.value) {
    totalPomodoriDone.value -= (currentPomodoroNumber.value - 1)
  } else {
    totalPomodoriDone.value -= currentPomodoroNumber.value
  }
  currentPomodoroNumber.value = 1
  resetTimer()
}
</script>

<style>
:root {
  --grey: #2c3e50;
  --white: rgb(252, 252, 252)
}

#app {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

footer {
  display:grid;
  grid-template-columns: repeat(3,1fr);
}

button:hover {
  cursor: pointer;
}

button {
  border: none;
  background: transparent;
}

.working {
  color: rgba(204, 27, 0, 1);
  background-color: rgba(255, 181, 170, 0.5);
}

.not-working {
  color: rgba(0, 204, 27, 1);
  background-color: rgba(170, 255, 182, 0.5);
}

#timer {
  font-size: 10vh;
  font-weight: bold;
  padding: 0.2rem 1rem;
  border-radius: 4rem;
  margin-top: 0.25rem;
  /* -webkit-text-stroke: 1.5px var(--grey); */
}

.progress-background-base {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  /* background: rgb(255,0,0) */
}

.stats-block {
  text-align: left;
  position: absolute;
  margin-top: 5px;
  margin-right: 5px;
  right: 0;
  font-size: 1.25rem;
  border: none;
  color: rgba(0, 0, 0, 0.8)
}

.options-block {
  text-align: left;
  position: absolute;
  margin-top: 5px;
  margin-right: 5px;
  left: 5px;
  font-size: 20px;
  border: none;
  color: rgba(0, 0, 0, 0.8)
}

.info-value {
  text-decoration: underline;
}

footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
}

a {
  color: #00308F;
}

#fullscreen-logo {
  height: 50px;
}

.minute-button {
  display: inline;
  margin-top: 1.5vh;
}

#timer-group {
  display: flex;
  align-items: center;
  justify-content: center;
}
.focus-label {
  font-style: italic;
  color:grey;
  font-size: 1.5rem;
}
#selected-task {
  text-decoration: underline;
}
.blink {
  color: orange !important
}
</style>
