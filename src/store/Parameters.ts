import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import PomodoroTime from '@/interfaces/PomodoroTime'
import BreakTime from '@/interfaces/BreakTime'
export const useParameters = defineStore('parameters', () => {
  const pomodoroTime = useStorage<PomodoroTime>('pomodoroTime', { minutes: 25, seconds: 0 }, localStorage)
  const breakTime = useStorage<BreakTime>('breakTime', { small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } }, localStorage)
  const audioEnabled = useStorage<boolean>('audioEnabled', true, localStorage)
  const grandiantEnabled = useStorage<boolean>('gradiantEnabled', false, localStorage)
  const pomodoriByCycle = useStorage<number>('pomodoriByCycle', 4, localStorage)
  const goal = useStorage<number>('goal', 0, localStorage)

  return { pomodoroTime, breakTime, audioEnabled, grandiantEnabled, pomodoriByCycle, goal }
})
