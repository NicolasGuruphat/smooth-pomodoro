

<template>
  <div class="progress-background-base" :style="progressBackgroundGradiant">
    <StatistiquesBlock class="stats-block" :currentPomoroNumber="currentPomoroNumber" :pomodoriByCycle="pomodoriByCycle"
      :totalPomodoriDone="totalPomodoriDone" :goal="goal" :timer="timer" :pomodoroTime="pomodoroTime" :breakTime="breakTime">
    </StatistiquesBlock>
    <OptionsBlock class="options-block" :pomodoriByCycle="pomodoriByCycle" :totalPomodoriDone="totalPomodoriDone"
      :pomodoroTime="pomodoroTime" :breakTime="breakTime" :goal="goal" :grandiantEnabled="grandiantEnabled"
      :audioEnabled="audioEnabled" @updatePomodoriByCycle="($event) => pomodoriByCycle = $event"
      @updateBigBreakTime="($event) => breakTime.big.minutes = $event"
      @updateSmallBreakTime="($event) => breakTime.small.minutes = $event" @updateGoal="($event) => goal = $event"
      @updatePomodoroTime="($event) => pomodoroTime.minutes = $event"
      @updateGradiantEnabled="($event) => grandiantEnabled = $event"
      @updateAudioEnabled="($event) => audioEnabled = $event">
    </OptionsBlock>

    <span class="timer" :class="{ 'working': working, 'not-working': !working }">{{ timer }}</span>
    <div>
      <ActionButton :action="startOrStop">{{ startOrStopLabel }}</ActionButton>
      <ActionButton :action="skipCurrentPomodoro">SKIP</ActionButton>
      <ActionButton :action="globalReset">RESET</ActionButton>
      <ActionButton :action="goBackToFirstPomodoro" :enabled="currentPomoroNumber != 1 || !working">➔1<sup>st</sup>
      </ActionButton>
    </div>
    <ProgressBar :goal="goal" :totalPomodoriDone="totalPomodoriDone" :pomodoriByCycle="pomodoriByCycle">

    </ProgressBar>
    <footer>
      <div>Smooth Pomodoro - by Nicolas Guruphat</div>
      <a href="https://www.flaticon.com/authors/pixel-perfect" title="tomato icons">Tomato icons created by Pixel perfect
        - Flaticon</a>
      <br>
      <a href="https://freesound.org/people/InspectorJ/sounds/411575/">Sound effect by InspectorJ - Freesound</a>
    </footer>
  </div>
</template>

<script setup>
import ActionButton from './components/ActionButton.vue';
import StatistiquesBlock from './components/StatistiquesBlock.vue';
import OptionsBlock from './components/OptionsBlock.vue'
import ProgressBar from './components/ProgressBar.vue';
import { ref, reactive, computed } from 'vue';
import { onMounted } from 'vue';

let pomodoroTime = reactive({ minutes: 25, seconds: 0 });
let breakTime = reactive({ small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } });
let grandiantEnabled = ref(false);
let audioEnabled = ref(true);
let pomodoriByCycle = ref(4);
let seconds = ref(null);
let minutes = ref(null);
let startOrStopLabel = ref("START");
let intervalId = ref(null);
let working = ref(true);
//let progression = ref(0);
let currentPomoroNumber = ref(1); // between 1 and 4
let totalPomodoriDone = ref(0);
let goal = ref(0);
let soundEffect = ref(new Audio(require("./assets/gong_hit.wav")));
onMounted(() => {
  minutes.value = pomodoroTime.minutes;
  seconds.value = pomodoroTime.seconds;
});

const timer = computed(() => {
  checkTime();
  let minutesToDisplay = minutes.value < 10 ? "0" + minutes.value : minutes.value;
  let secondsToDisplay = seconds.value < 10 ? "0" + seconds.value : seconds.value;
  return minutesToDisplay + ":" + secondsToDisplay;
})
const progressBackgroundGradiant = computed(() => {
  if (grandiantEnabled.value) {
    let baseTime = working.value ? pomodoroTime.minutes * 60 + pomodoroTime.seconds : breakTime.small.minutes * 60 + breakTime.small.seconds * 60;
    let currentTime = baseTime - (minutes.value * 60 + seconds.value)
    let progression = ((currentTime / baseTime) - 0.5) * 100 * 2 * -1
    if (working.value) {
      return {
        "background": `linear-gradient(75deg, #ffb5aa ${progression}%, #aaffb6 100%)`
      };
    } else {
      return {
        "background": "green"
        // "background": `linear-gradient(75deg, rgba(255,0,0,1) 100%,  rgba(0,255,12,1) ${progression}%)`
      };
    }
  } else {
    return { "background-color": working.value ? "#ffb5aa" : "#aaffb6" };
  }
})
function startOrStop() {
  if (startOrStopLabel.value === "STOP") {
    startOrStopLabel.value = "START"
    clearInterval(intervalId.value)
    intervalId.value = null
  } else {
    startOrStopLabel.value = "STOP"
    startTimer()
  }
}
function checkTime() {
  if (seconds.value == -1) {
    seconds.value = 59
    minutes.value--
    if (minutes.value == -1) {
      switchSession()
    }
  }
}
function startTimer() {
  intervalId.value = setInterval(() => {
    seconds.value--;
  }, 1000)
}
function switchSession() {
  if (audioEnabled.value) {
    soundEffect.value.play()
  }
  if (working.value) {
    // switch to pause session
    if (currentPomoroNumber.value == pomodoriByCycle.value) {
      minutes.value = breakTime.big.minutes;
      seconds.value = breakTime.big.seconds;
    } else {
      minutes.value = breakTime.small.minutes;
      seconds.value = breakTime.small.seconds;
    }
    totalPomodoriDone.value += 1
  } else {
    // switch to work session
    currentPomoroNumber.value = (currentPomoroNumber.value) % pomodoriByCycle.value + 1
    minutes.value = pomodoroTime.minutes
    seconds.value = pomodoroTime.seconds

  }
  working.value = !working.value
}
function skipCurrentPomodoro() {
  minutes.value = 0;
  seconds.value = 0;
  seconds.value--;
}

function globalReset() {
  resetTimer();
  totalPomodoriDone.value = 0;
  currentPomoroNumber.value = 1;
}

function goBackToFirstPomodoro() {
  // go back to the first pomodoro of the current group of 
  if (working.value) {
    totalPomodoriDone.value -= (currentPomoroNumber.value - 1)
  } else {
    totalPomodoriDone.value -= currentPomoroNumber.value
  }
  currentPomoroNumber.value = 1
  resetTimer()
}

function resetTimer() {
  minutes.value = pomodoroTime.minutes
  seconds.value = pomodoroTime.seconds
  working.value = true

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

.timer {
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
</style>
