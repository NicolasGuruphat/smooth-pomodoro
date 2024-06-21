import type PomodoroTime from '../PomodoroTime'
import type BreakTime from '../BreakTime'

export default interface ParametersReturn {
  pomodoroTime: PomodoroTime,
  breakTime: BreakTime,
  audioEnabled: boolean,
  gradiantEnabled: boolean,
  pomodoriByCycle: number,
  goal: number
}
