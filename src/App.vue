<template ref="app">
  <div class="progress-background-base" :style="progressBackgroundGradiant">
    <StatistiquesBlock class="stats-block" :currentPomodoroNumber="currentPomodoroNumber" :pomodoriByCycle="pomodoriByCycle"
      :totalPomodoriDone="totalPomodoriDone" :goal="goal" :timer="timer">
    </StatistiquesBlock>
    <OptionsBlock class="options-block" :pomodoriByCycle="pomodoriByCycle" :totalPomodoriDone="totalPomodoriDone"
      :goal="goal" :grandiantEnabled="grandiantEnabled"
      :audioEnabled="audioEnabled" @updatePomodoriByCycle="($event: number) => pomodoriByCycle = $event"
      @updateGoal="($event: number) => goal = $event"
      @updateGradiantEnabled="($event: boolean) => grandiantEnabled = $event"
      @updateAudioEnabled="($event: boolean) => audioEnabled = $event">
    </OptionsBlock>
    <img :style="[isFullscreen ? 'opacity:0.5' : 'opacity:1']" id="fullscreen-logo"  @click="toggle" :src="fullscreenLogo" alt="fullscreen-logo" />
    <div id="timer-group">
    <ActionButton id="remove-one-minute-button" :action="removeOneMinute">&#60;</ActionButton>
    <span id="timer" :class="{ 'working': working, 'not-working': !working }">{{ timer }}</span>
    <ActionButton id="add-one-minute-button" :action="addOneMinute">&#62;</ActionButton>
  </div>
    <div>
      <ActionButton id="start-stop-button" :action="startOrStop">{{ startOrStopLabel }}</ActionButton>
      <ActionButton id="skip-button" :action="skipCurrentPomodoro">SKIP</ActionButton>
      <ActionButton id="reset-button" :action="globalReset">RESET</ActionButton>
      <ActionButton id="go-to-first-button" :action="goBackToFirstPomodoro" :enabled="currentPomodoroNumber != 1 || !working">➔1<sup>st</sup>
      </ActionButton>
    </div>
    <ProgressBar :goal="goal" :totalPomodoriDone="totalPomodoriDone" :pomodoriByCycle="pomodoriByCycle">

    </ProgressBar>
    <div ref="todoList" :style="style" style="position: fixed">
      <todoList></todoList>
    </div>
    <footer>
      <div>Smooth Pomodoro - by Nicolas Guruphat</div>
      <a href="https://www.flaticon.com/authors/pixel-perfect" title="tomato icons">Tomato icons created by Pixel perfect
        - Flaticon</a>
      <br>
      <a href="https://freesound.org/people/InspectorJ/sounds/411575/">Sound effect by InspectorJ - Freesound</a>
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
import { ref, reactive, computed } from 'vue'
import fullscreenLogo from '@/assets/fullscreen.svg'
import { useFullscreen, useFavicon, useDraggable } from '@vueuse/core'
import { storeToRefs } from 'pinia'

const app = ref(null)

const store = useParameters()
const { pomodoroTime, breakTime } = storeToRefs(store)

const { isFullscreen, toggle } = useFullscreen(app)

const todoList = ref<HTMLElement | null>(null)

const { x, y, style } = useDraggable(todoList, {
  initialValue: { x: 40, y: 40 }
})

const intervalId = ref<number | null>(null)
function startTimer () : void {
  intervalId.value = setInterval(() => {
    seconds.value--
  }, 1000)
}

const startOrStopLabel = ref<string>('START')
function startOrStop () : void {
  if (startOrStopLabel.value === 'STOP') {
    startOrStopLabel.value = 'START'
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  } else {
    startOrStopLabel.value = 'STOP'
    startTimer()
  }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const soundEffect = ref(new Audio(require('./assets/gong_hit.wav')))
const audioEnabled = ref<boolean>(true)
const working = ref<boolean>(true)
const pomodoriByCycle = ref<number>(4)
const currentPomodoroNumber = ref<number>(1)
function switchSession () : void {
  if (audioEnabled.value) {
    soundEffect.value.play()
  }
  if (working.value) {
    // switch to pause session
    changeIcon('green')
    if (currentPomodoroNumber.value === pomodoriByCycle.value) {
      minutes.value = breakTime.value.big.minutes
      seconds.value = breakTime.value.big.seconds
    } else {
      minutes.value = breakTime.value.small.minutes
      seconds.value = breakTime.value.small.seconds
    }
    totalPomodoriDone.value += 1
  } else {
    changeIcon('red')
    // switch to work session
    currentPomodoroNumber.value = (currentPomodoroNumber.value) % pomodoriByCycle.value + 1
    minutes.value = pomodoroTime.value.minutes
    seconds.value = pomodoroTime.value.seconds
  }
  working.value = !working.value
}

const grandiantEnabled = ref<boolean>(false)
const progressBackgroundGradiant = computed(() => {
  if (grandiantEnabled.value) {
    const baseTime : number = working.value ? pomodoroTime.value.minutes * 60 + pomodoroTime.value.seconds : breakTime.value.small.minutes * 60 + breakTime.value.small.seconds * 60
    const currentTime : number = baseTime - (minutes.value * 60 + seconds.value)
    if (working.value) {
      const progression : number = ((currentTime / baseTime) - 1 / 3) * 100 * 3 * -1

      return {
        background: `linear-gradient(75deg, #ffb5aa ${progression}%, #aaffb6 100%)`
      }
    } else {
      const progression : number = ((currentTime / baseTime) - 0.2) * 100 * 5 * -1
      return {
        background: `linear-gradient(-105deg, #aaffb6 ${progression}%, #ffb5aa 100%)`
      }
    }
  } else {
    return { 'background-color': working.value ? '#ffb5aa' : '#aaffb6' }
  }
})

const minutes = ref<number>(pomodoroTime.value.minutes)
const seconds = ref<number>(pomodoroTime.value.seconds)

// let progression = ref(0);
const totalPomodoriDone = ref<number>(0)
const goal = ref<number>(0)

const timer = computed(() => {
  checkTime()
  const minutesToDisplay : string = minutes.value < 10 ? '0' + minutes.value : minutes.value.toString()
  const secondsToDisplay : string = seconds.value < 10 ? '0' + seconds.value : seconds.value.toString()
  return minutesToDisplay + ':' + secondsToDisplay
})

function checkTime () : void {
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

function addOneMinute () : void {
  minutes.value++
}

function removeOneMinute () : void {
  minutes.value--
}

function skipCurrentPomodoro () : void {
  minutes.value = 0
  seconds.value = 0
  seconds.value--
}

function globalReset () : void {
  resetTimer()
  totalPomodoriDone.value = 0
  currentPomodoroNumber.value = 1
}

function goBackToFirstPomodoro () : void {
  // go back to the first pomodoro of the current group of
  if (working.value) {
    totalPomodoriDone.value -= (currentPomodoroNumber.value - 1)
  } else {
    totalPomodoriDone.value -= currentPomodoroNumber.value
  }
  currentPomodoroNumber.value = 1
  resetTimer()
}

function resetTimer () : void {
  minutes.value = pomodoroTime.value.minutes
  seconds.value = pomodoroTime.value.seconds
  working.value = true
}

const icon = useFavicon()

function changeIcon (color : string) : void {
  switch (color) {
    case 'green':
      icon.value = 'greenTomato.png'
      break
    case 'red':
      icon.value = 'redTomato.png'
      break
  }
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

.working {
  color: #cc1b00
}

.not-working {
  color: #00cc1b
}

#timer {
  font-size: 10vh;
  font-weight: bold;
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
  font-size: 20px;
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

.info-label {
  float: left;
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

#fullscreen-logo{
  position: absolute;
  bottom: 5px;
  left: 5px;
  height:50px;
  z-index: 2;
}

#add-one-minute-button{
  display: inline;
}

#remove-one-minute-button{
  display: inline;
}

#timer-group{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
