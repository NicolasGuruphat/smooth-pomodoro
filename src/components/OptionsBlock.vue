<template>
  <div>
    <details>
      <summary class="block-opener" style="list-style-type: '⚙️'"></summary>
      <div>
        <div class="option">
          <span class="info-label">🍅 Number of pomodori by cycle</span>
          <span class="stat-selector">
          <span class="info-value">{{ pomodoriByCycle }}</span>
            <button class="stat-selector-button"
              :class="{ 'disabled': pomodoriByCycle == 1, 'enabled-selector': pomodoriByCycle != 1, 'disabled-selector': pomodoriByCycle == 1 }"
              @click="pomodoriByCycle -= 1">-</button>
            <button class="stat-selector-button enabled-selector"
              @click="pomodoriByCycle += 1">+</button>
          </span>
        </div>
        <div class="option">
          <span class="info-label">🎯 Pomodori goal</span>
          <span class="stat-selector">
            <span class="info-value">{{ goal }}</span>
            <button class="stat-selector-button"
              :class="{ 'disabled': goal == 0, 'enabled-selector': goal != 0, 'disabled-selector': goal == 0 }"
              @click=" goal -= 1" :disabled="goal == 0">-</button>
            <button class="stat-selector-button"
                    :class="{ 'disabled': goal == 100, 'enabled-selector': goal != 100, 'disabled-selector': goal == 100 }"
                    @click=" goal += 1" :disabled="goal == 100">+</button>
          </span>
        </div>
        <div class="option">
          <span class="info-label">✨ Gradiant background</span>
          <input type="checkbox" class="stat-selector stat-selector-button enabled-selector checkbox-selector"
            v-model="gradiantEnabled">
          <label for="checkbox"></label>
        </div>
        <div class="option">
          <span class="info-label">🔉 Sound effect</span>
          <input type="checkbox" class="stat-selector stat-selector-button enabled-selector checkbox-selector"
            v-model="audioEnabled">
          <label for="checkbox"></label>
        </div>
        <details class="option">
          <summary class="info-label block-opener">⏲️ Timer options (in minutes)</summary>
          <ul>
            <li class="option">
                <span class="info-label">Pomodoro</span>
                <span class="stat-selector">
                  <span class="info-value">{{ pomodoroTime.minutes }}</span>
                  <button class="stat-selector-button"
                    :class="{ 'disabled': pomodoroTime.minutes == 1, 'enabled-selector': pomodoroTime.minutes != 1, 'disabled-selector': pomodoroTime.minutes == 1 }"
                    @click="pomodoroTime.minutes -= 1" :disabled="pomodoroTime.minutes == 0">-</button>
                  <button class="stat-selector-button enabled-selector" @click="pomodoroTime.minutes += 1">+</button>
                </span>
            </li>
            <li class="option">
                <span class="info-label">Small break</span>
                <span class="stat-selector">
                  <span class="info-value">{{ breakTime.small.minutes
                }}</span>
                  <button class="stat-selector-button"
                    :class="{ 'disabled': breakTime.small.minutes == 1, 'enabled-selector': breakTime.small.minutes != 1, 'disabled-selector': breakTime.small.minutes == 1 }"
                    @click="breakTime.small.minutes -= 1" :disabled="breakTime.small.minutes == 0">-</button>
                  <button class="stat-selector-button enabled-selector" @click="breakTime.small.minutes += 1">+</button>
                </span>
            </li>
            <li class="option">
                <span class="info-label">Big break</span>
                <span class="stat-selector">
                  <span class="info-value">{{ breakTime.big.minutes }}</span>
                  <button class="stat-selector-button"
                    :class="{ 'disabled': breakTime.big.minutes == 1, 'enabled-selector': breakTime.big.minutes != 1, 'disabled-selector': breakTime.big.minutes == 1 }"
                    @click="breakTime.big.minutes -= 1" :disabled="breakTime.big.minutes == 0">-</button>
                  <button class="stat-selector-button enabled-selector" @click="breakTime.big.minutes += 1">+</button>
                </span>
            </li>
          </ul>
        </details>

      </div>
    </details>
    <button id="open-todo-button" @click="$emit('update:showTodo', !showTodo)">🧾</button>
  </div>
</template>
<script setup lang="ts">
import { useParameters } from '@/store/Parameters'
import { storeToRefs } from 'pinia'

const store = useParameters()

defineProps({
  showTodo: {
    type: Boolean,
    required: true
  }
})

const { pomodoroTime, breakTime, audioEnabled, gradiantEnabled, pomodoriByCycle, goal } = storeToRefs(store)

</script>
<style scoped>
.option {
  width: 400px;
  height: 30px;
  background: rgba(252, 252, 252, 0.7);
  border-radius: 1rem;
  padding: 0.2rem 0.4rem;
  margin: 0.2rem 0 ;
}

.stat-selector {
  display: inline-block;
  right: 0.4rem;
  position: absolute;
}

.stat-selector-button {
  display: inline-block;
  height: 20px;
  width: 20px;
  text-align: center;
  border-radius: 10px;
  border: 1px solid black;
  font-weight: bold;
}

.disabled {
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: rgba(252, 252, 252, 1);
}

.info-value {
  margin-right: 0.5rem;
}
.enabled-selector {
  background-color: rgba(252, 252, 252, 0.5);
  color: rgba(0, 0, 0, 1);
}

.checkbox-selector {
  accent-color: rgba(252, 252, 252, 0.5);
}
.block-opener:hover{
  cursor: pointer;
}
li:before{
  content:"⏱️ "
}
li.option{
  width: 100%;
}
ul {
  list-style: none;
  margin: 1rem 0 0 0 ;
}

#open-todo-button {
  position: absolute;
  left: 2.5rem;
  top: 0;
  background-color: transparent;
  font-size: 1.25rem;
  padding: 0;
  border: none;
}
</style>
