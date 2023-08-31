import ProgressBar from '@/components/ProgressBar'
import { mount } from '@vue/test-utils'

describe('Progress Bar', () => {
  it('Display nothing when there is no goal set', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        goal: 0,
        totalPomodoriDone: 0,
        pomodoriByCycle: 0
      }
    })
    expect(wrapper.text()).toEqual('')
  })
  it('Display proper icons when there is 0 pomodoro done', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        goal: 4,
        totalPomodoriDone: 0,
        pomodoriByCycle: 4
      }
    })
    expect(wrapper.text()).toEqual('⭕  🟥  🟥  🟥')
  })
  it('Display proper icons when there is a big break', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        goal: 5,
        totalPomodoriDone: 0,
        pomodoriByCycle: 4
      }
    })
    expect(wrapper.text()).toEqual('⭕  🟥  🟥  🟥  🟨  🟥')
  })
  it('Display proper icons when there is a pomodoro done', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        goal: 5,
        totalPomodoriDone: 1,
        pomodoriByCycle: 4
      }
    })
    expect(wrapper.text()).toEqual('🟩  ⭕  🟥  🟥  🟨  🟥')
  })
  it('Display proper icons when the goal is reached', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        goal: 4,
        totalPomodoriDone: 4,
        pomodoriByCycle: 4
      }
    })
    expect(wrapper.text()).toEqual('🟩  🟩  🟩  🟩  🟩')
  })
  it('Display proper icons when there is a big break before the current total pomodori done', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        goal: 7,
        totalPomodoriDone: 5,
        pomodoriByCycle: 4
      }
    })
    expect(wrapper.text()).toEqual('🟩  🟩  🟩  🟩  🟨  🟩  ⭕  🟥')
  })
})
