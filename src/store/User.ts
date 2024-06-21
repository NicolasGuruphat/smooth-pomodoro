import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { defaultValuesParameters } from './Parameters'
import type UserReturn from '@/interfaces/store/UserReturn'

export const defaultValuesUser : UserReturn = {
  currentPomodoroNumber: 1,
  totalPomodoriDone: 0,
  minutes: defaultValuesParameters.pomodoroTime.minutes,
  seconds: defaultValuesParameters.pomodoroTime.seconds
}

export const useUser = defineStore('user', () => {
  const currentPomodoroNumber = useStorage<number>('currentPomodoroNumber', defaultValuesUser.totalPomodoriDone, localStorage)
  const totalPomodoriDone = useStorage<number>('totalPomodoriDone', defaultValuesUser.currentPomodoroNumber, localStorage)
  const minutes = useStorage<number>('minutes', defaultValuesUser.minutes, localStorage)
  const seconds = useStorage<number>('seconds', defaultValuesUser.seconds, localStorage)

  const reset = (): void => {
    currentPomodoroNumber.value = defaultValuesUser.currentPomodoroNumber
    totalPomodoriDone.value = defaultValuesUser.totalPomodoriDone
    minutes.value = defaultValuesUser.minutes
    seconds.value = defaultValuesUser.seconds
  }

  return { currentPomodoroNumber, totalPomodoriDone, minutes, seconds, reset }
})

export type UserStore = ReturnType<typeof useUser>
