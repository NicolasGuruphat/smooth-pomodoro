import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import PomodoroTime from '@/interfaces/PomodoroTime'
import BreakTime from '@/interfaces/BreakTime'
export const useParameters = defineStore('parameters', () => {
  const defaultValues = {
    pomodoroTime: { minutes: 25, seconds: 0 },
    breakTime: { small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } },
    audioEnabled: true,
    grandiantEnabled: false,
    pomodoriByCycle: 4,
    goal: 0
  }

  const pomodoroTime = useStorage<PomodoroTime>('pomodoroTime', defaultValues.pomodoroTime, localStorage)
  const breakTime = useStorage<BreakTime>('breakTime', defaultValues.breakTime, localStorage)
  const audioEnabled = useStorage<boolean>('audioEnabled', defaultValues.audioEnabled, localStorage)
  const grandiantEnabled = useStorage<boolean>('gradiantEnabled', defaultValues.grandiantEnabled, localStorage)
  const pomodoriByCycle = useStorage<number>('pomodoriByCycle', defaultValues.pomodoriByCycle, localStorage)
  const goal = useStorage<number>('goal', defaultValues.goal, localStorage)

  const reset = () : void => {
    pomodoroTime.value = defaultValues.pomodoroTime
    breakTime.value = defaultValues.breakTime
    audioEnabled.value = defaultValues.audioEnabled
    grandiantEnabled.value = defaultValues.grandiantEnabled
    pomodoriByCycle.value = defaultValues.pomodoriByCycle
    goal.value = defaultValues.goal
  }

  return { pomodoroTime, breakTime, audioEnabled, grandiantEnabled, pomodoriByCycle, goal, reset }
})

export type ParametersStore = ReturnType<typeof useParameters>
