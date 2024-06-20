import { defineStore, storeToRefs } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useParameters } from './Parameters'

export const useUser = defineStore('user', () => {
  const store = useParameters()
  const { pomodoroTime } = storeToRefs(store)

  const defaultValues = {
    currentPomoroNumber: 1,
    totalPomodoriDone: 0,
    minutes: pomodoroTime.value.minutes,
    seconds: pomodoroTime.value.seconds
  }

  const currentPomodoroNumber = useStorage<number>('currentPomodoroNumber', defaultValues.totalPomodoriDone, localStorage)
  const totalPomodoriDone = useStorage<number>('totalPomodoriDone', defaultValues.currentPomoroNumber, localStorage)
  const minutes = useStorage<number>('minutes', defaultValues.minutes, localStorage)
  const seconds = useStorage<number>('seconds', defaultValues.seconds, localStorage)

  const reset = () : void => {
    currentPomodoroNumber.value = defaultValues.currentPomoroNumber
    totalPomodoriDone.value = defaultValues.totalPomodoriDone
    minutes.value = defaultValues.minutes
    seconds.value = defaultValues.seconds
  }

  return { currentPomodoroNumber, totalPomodoriDone, minutes, seconds, reset }
})

export type UserStore = ReturnType<typeof useUser>
