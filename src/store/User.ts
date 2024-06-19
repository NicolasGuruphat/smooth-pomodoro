import { defineStore, storeToRefs } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useParameters } from './Parameters'

export const useUser = defineStore('user', () => {
  const store = useParameters()
  const { pomodoroTime } = storeToRefs(store)

  const currentPomodoroNumber = useStorage<number>('currentPomodoroNumber', 1, localStorage)
  const totalPomodoriDone = useStorage<number>('totalPomodoriDone', 0, localStorage)
  const minutes = useStorage<number>('minutes', pomodoroTime.value.minutes, localStorage)
  const seconds = useStorage<number>('seconds', pomodoroTime.value.seconds, localStorage)

  return { currentPomodoroNumber, totalPomodoriDone, minutes, seconds }
})
