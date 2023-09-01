import StatistiquesBlock from '@/components/StatistiquesBlock.vue'
import { VueWrapper, mount } from '@vue/test-utils'

describe('Goal statistique', () => {
  const goalPart = (wrapper : VueWrapper) : string => { return wrapper.text().split('🎯')[1] }
  it('display nothing when there is no goal set', () => {
    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 0,
        currentPomodoroNumber: 0,
        pomodoriByCycle: 4,
        goal: 0,
        pomodoroTime: { minutes: 25, seconds: 0 },
        breakTime: { small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } }
      }
    })
    console.log(typeof wrapper)

    expect(wrapper.vm.goalStat).toBe('0')
    expect(goalPart(wrapper)).toBe(' 0')
  })
  it('display goal when there is a goal set', () => {
    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 0,
        currentPomodoroNumber: 1,
        pomodoriByCycle: 4,
        goal: 1,
        pomodoroTime: { minutes: 25, seconds: 0 },
        breakTime: { small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } }
      }
    })
    expect(wrapper.vm.goalStat).toBe('0 / 1')
    expect(goalPart(wrapper)).toBe(' 0 / 1')
  })
  it('display goal when there is a goal set', () => {
    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 5,
        currentPomodoroNumber: 1,
        pomodoriByCycle: 4,
        goal: 4,
        pomodoroTime: { minutes: 25, seconds: 0 },
        breakTime: { small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } }
      }
    })
    expect(wrapper.vm.goalStat).toBe('5 / 4')
    expect(goalPart(wrapper)).toBe(' 5 / 4')
  })
})

describe('Cycle statistique', () => {
  const cyclePart = (wrapper : VueWrapper) : string => { return wrapper.text().split('🎯')[0].split('🍅')[1] }
  it('display cycle', () => {
    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 0,
        currentPomodoroNumber: 1,
        pomodoriByCycle: 4,
        goal: 0,
        pomodoroTime: { minutes: 25, seconds: 0 },
        breakTime: { small: { minutes: 5, seconds: 0 }, big: { minutes: 15, seconds: 0 } }
      }
    })
    expect(wrapper.vm.cycleStat).toBe('1 / 4')
    expect(cyclePart(wrapper)).toBe(' 1 / 4 ')
  })
})
