import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type PomodoroTime from '@/interfaces/PomodoroTime'
import type BreakTime from '@/interfaces/BreakTime'
import type ParametersReturn from '@/interfaces/store/ParametersReturn'

export const defaultValuesParameters : ParametersReturn = {
  pomodoroTime: { minutes: 25, seconds: 0 },
  breakTime: { small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } },
  audioEnabled: true,
  gradiantEnabled: false,
  pomodoriByCycle: 4,
  goal: 0
}

export const useParameters = defineStore('parameters', () => {
  const pomodoroTime = useStorage<PomodoroTime>('pomodoroTime', defaultValuesParameters.pomodoroTime, localStorage)
  const breakTime = useStorage<BreakTime>('breakTime', defaultValuesParameters.breakTime, localStorage)
  const audioEnabled = useStorage<boolean>('audioEnabled', defaultValuesParameters.audioEnabled, localStorage)
  const gradiantEnabled = useStorage<boolean>('gradiantEnabled', defaultValuesParameters.gradiantEnabled, localStorage)
  const pomodoriByCycle = useStorage<number>('pomodoriByCycle', defaultValuesParameters.pomodoriByCycle, localStorage)
  const goal = useStorage<number>('goal', defaultValuesParameters.goal, localStorage)

  const reset = () : void => {
    pomodoroTime.value = defaultValuesParameters.pomodoroTime
    breakTime.value = defaultValuesParameters.breakTime
    audioEnabled.value = defaultValuesParameters.audioEnabled
    gradiantEnabled.value = defaultValuesParameters.gradiantEnabled
    pomodoriByCycle.value = defaultValuesParameters.pomodoriByCycle
    goal.value = defaultValuesParameters.goal
  }

  return { pomodoroTime, breakTime, audioEnabled, gradiantEnabled, pomodoriByCycle, goal, reset }
})

export type ParametersStore = ReturnType<typeof useParameters>
