import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useParameters = defineStore('app', () => {
  const pomodoroTime = reactive({ minutes: 25, seconds: 0 })
  const breakTime = reactive({ small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } })
  return { pomodoroTime, breakTime }
})
