<template>
  <details>
    <summary class="block-opener">⚙️</summary>
    <div>
      <div class="option">
        <span class="info-label">🍅 Number of pomodori by cycle : <span class="info-value">{{pomodoriByCycle}}</span></span>
        <span class="stat-selector">
          <button class="stat-selector-button" :class="{'disabled':pomodoriByCycle==1, 'enabled-selector':pomodoriByCycle!=1, 'disabled-selector':pomodoriByCycle==1}" @click="$emit('updatePomodoriByCycle',pomodoriByCycle-1)" >-</button>
          <button class="stat-selector-button enabled-selector" @click="$emit('updatePomodoriByCycle',pomodoriByCycle+1)">+</button>
        </span>
      </div>
      <div class="option">
        <span class="info-label">🎯 Pomodori goal : <span class="info-value">{{goal}}</span></span>
        <span class="stat-selector">
          <button class="stat-selector-button" :class="{'disabled':goal==0, 'enabled-selector':goal!=0, 'disabled-selector':goal==0}" @click="$emit('updateGoal',goal-1)" :disabled="goal==0">-</button>
          <button class="stat-selector-button enabled-selector" @click="$emit('updateGoal',goal+1)">+</button>
        </span>
      </div>
      <div class="option">
        <span class="info-label">✨ Gradiant background</span>
        <input type="checkbox" class="stat-selector stat-selector-button enabled-selector checkbox-selector" v-model="grandiantEnabledOption">
        <label for="checkbox"></label>
      </div>
      <div class="option">
        <span class="info-label">🔉 Sound effect</span>
        <input type="checkbox" class="stat-selector stat-selector-button enabled-selector checkbox-selector" v-model="audioEnabledOption">
        <label for="checkbox"></label>
      </div>
      <details class="option">
        <summary class="info-label block-opener">⏲️ Timer options (in minutes)</summary>
        <br>
        <ul>
          <li>
            <div class="option">
              <span class="info-label">Pomodoro   : <span class="info-value">{{ pomodoroTime.minutes }}</span></span>
              <span class="stat-selector">
                <button class="stat-selector-button" :class="{'disabled':pomodoroTime.minutes==1, 'enabled-selector':pomodoroTime.minutes!=1, 'disabled-selector':pomodoroTime.minutes==1}" @click="pomodoroTime.minutes-=1" :disabled="pomodoroTime.minutes==0">-</button>
                <button class="stat-selector-button enabled-selector" @click="pomodoroTime.minutes+=1">+</button>
              </span>
            </div>
          </li>
          <li>
            <div class="option">
              <span class="info-label">Small break : <span class="info-value">{{ breakTime.small.minutes }}</span></span>
              <span class="stat-selector">
                <button class="stat-selector-button" :class="{'disabled':breakTime.small.minutes==1, 'enabled-selector':breakTime.small.minutes!=1, 'disabled-selector':breakTime.small.minutes==1}" @click="breakTime.small.minutes-=1" :disabled="breakTime.small.minutes==0">-</button>
                <button class="stat-selector-button enabled-selector" @click="breakTime.small.minutes+=1">+</button>
              </span>
            </div>
          </li>
          <li>
            <div class="option">
              <span class="info-label">Big break   : <span class="info-value">{{ breakTime.big.minutes }}</span></span>
              <span class="stat-selector">
                <button class="stat-selector-button" :class="{'disabled':breakTime.big.minutes==1, 'enabled-selector':breakTime.big.minutes!=1, 'disabled-selector':breakTime.big.minutes==1}" @click="breakTime.big.minutes-=1" :disabled="breakTime.big.minutes==0">-</button>
                <button class="stat-selector-button enabled-selector" @click="breakTime.big.minutes+=1">+</button>
              </span>
            </div>
          </li>
        </ul>
      </details>

    </div>
  </details>
</template>
<script setup lang="ts">
import { useParameters } from '@/store/Parameters'
import { ref, watch, defineEmits, defineProps } from 'vue'
import { storeToRefs } from 'pinia'

const store = useParameters()
const { pomodoroTime, breakTime } = storeToRefs(store)

const props = defineProps({
  goal: {
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
  grandiantEnabled: {
    type: Boolean,
    required: true
  },
  audioEnabled: {
    type: Boolean,
    required: true
  }
})

const grandiantEnabledOption = ref(props.grandiantEnabled)
const audioEnabledOption = ref(props.audioEnabled)
const emits = defineEmits(['updateGradiantEnabled', 'audioEnabledOption'])

watch(grandiantEnabledOption, (newValue: boolean) => {
  emits('updateGradiantEnabled', newValue)
})
watch(audioEnabledOption, (newValue: boolean) => {
  emits('audioEnabledOption', newValue)
})
</script>
<style>
.option{
  width : 400px;
  height: 30px;
}
.stat-selector{
  display: inline-block;
  right: 0;
  position: absolute;
}
.stat-selector-button{
  display: inline-block;
  height: 20px;
  width: 20px;
  text-align: center;
  border-radius:10px;
  cursor: pointer;
  border: 1px solid black;
  font-weight: bold;
}
.disabled{
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: rgba(252,252,252,1);
}
.enabled-selector{
  background-color: rgba(252,252,252,0.5);
  color: rgba(0, 0, 0, 1 );
}
.checkbox-selector{
  accent-color: rgba(252,252,252,0.5);
}
.block-opener:hover{
  cursor: pointer;
}
ul{
  list-style: "⏱️";
  margin:0;
}
</style>
