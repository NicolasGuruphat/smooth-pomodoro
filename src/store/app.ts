import { defineStore } from 'pinia'

export const useUserStore = defineStore('app', {
  state: () => ({

  })
})

// - audioEnabled
// - grandiantEnabled
// - breakTime
// - pomodoroTime
//    - maybe create a distinct store
// - pomodoriByCycle
// - totalPomodoriDone
// Split en : user options (avec tout ce que peux régler l'utilisateur) et le reste (ex: valeur du chrono)
