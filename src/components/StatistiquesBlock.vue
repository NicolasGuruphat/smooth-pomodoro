<template>
    <div>
        <div class="stat">
            <span class="remaining-time">
                {{ timeBeforeBigBreak }}
            </span>
            <span class="info-label">
                🍅
            </span>
            <span class="info-value">
                {{ cycleStat }}
            </span>
        </div>

        <div class="stat">
            <span class="remaining-time">
                {{ }}
            </span>
            <span class="info-label">
                🎯
            </span>
            <span class="info-value">
            {{ goalStat }}
            </span>

        </div>
    </div>
</template>
<script setup lang="ts">

import { computed } from 'vue'

const props = defineProps({
  goal: {
    type: Number,
    required: true
  },
  currentPomodoroNumber: {
    type: Number,
    required: true
  },
  pomodoriByCycle: {
    type: Number,
    required: true
  },
  totalPomodoriDone: {
    type: Number,
    required: true
  },
  pomodoroTime: {
    type: Object,
    required: true
  },
  breakTime: {
    type: Object,
    required: true
  },
  timer: {
    type: String,
    required: true
  }
})

const timeBeforeBigBreak = computed(() => { return null })
/*
const timeBeforeGoal = computed(() => {
  const seconds = 0
  if (props.pomodoroTime.minutes !== undefined && props.pomodoroTime.seconds !== undefined) {
    // const timerSeconds = parseInt(this.timer.slice(0, 2) * 60) + parseInt(this.timer.slice(-2))
    // console.log(timerSeconds);
    // seconds = timerSeconds + (this.goal - 1) * (this.pomodoroTime.minutes * 60 + this.pomodoroTime.seconds) + (this.goal - 1) * (this.breakTime.small.minutes * 60 + this.breakTime.small.seconds) + (Math.floor(this.goal / this.pomodoriByCycle)) * (this.breakTime.big.minutes * 60 + this.breakTime.big.seconds)
  }
  return seconds / 60
})
*/
const goalStat = computed(() => {
  return props.totalPomodoriDone + (props.goal !== 0 ? ' / ' + props.goal : '')
})

const cycleStat = computed(() => {
  return props.currentPomodoroNumber + ' / ' + props.pomodoriByCycle
})

</script>
<style>
.stat {
    height: 30px;
}
</style>
