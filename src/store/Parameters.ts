import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useParameters = defineStore('app', () => {
  const pomodoroTime = useStorage('pomodoroTime', { minutes: 25, seconds: 0 }, localStorage)
  const breakTime = useStorage('breakTime', { small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } }, localStorage)
  return { pomodoroTime, breakTime }
})
