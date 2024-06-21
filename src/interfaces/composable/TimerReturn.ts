import type { ComputedRef, Ref } from 'vue'

export default interface TimerReturn {
    clock: Ref<HTMLElement | null>
    timer: ComputedRef<string>
    blinking: Ref<boolean>
    blink: Ref<boolean>
    startTimer: () => void
    stopTimer: () => void
    addOneMinute: () => void
    removeOneMinute: () => void
    startBlink: () => void
    stopBlink: () => void
}
