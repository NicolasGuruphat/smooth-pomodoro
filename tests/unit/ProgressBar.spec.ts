import ProgressBar from '@/components/ProgressBar.vue'
import { useParameters, ParametersStore } from '@/store/Parameters'
import { useUser, UserStore } from '@/store/User'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'

describe('Progress Bar', () => {
  let userStore: UserStore
  let parametersStore: ParametersStore
  beforeEach(() => {
    setActivePinia(createPinia())
    parametersStore = useParameters()
    parametersStore.reset()
    userStore = useUser()
    userStore.reset()
  })
  it('Display nothing when there is no goal set', () => {
    const { totalPomodoriDone } = storeToRefs(userStore)
    const { pomodoriByCycle, goal } = storeToRefs(parametersStore)

    totalPomodoriDone.value = 0
    pomodoriByCycle.value = 1
    goal.value = 0

    const wrapper = mount(ProgressBar)
    expect(wrapper.text()).toEqual('')
  })
  it('Display proper icons when there is 0 pomodoro done', () => {
    const { totalPomodoriDone } = storeToRefs(userStore)
    const { pomodoriByCycle, goal } = storeToRefs(parametersStore)

    goal.value = 4
    totalPomodoriDone.value = 0
    pomodoriByCycle.value = 4

    const wrapper = mount(ProgressBar)

    expect(wrapper.text()).toEqual('⭕  🟥  🟥  🟥')
  })
  it('Display proper icons when there is a big break', () => {
    const { totalPomodoriDone } = storeToRefs(userStore)
    const { pomodoriByCycle, goal } = storeToRefs(parametersStore)

    goal.value = 5
    totalPomodoriDone.value = 0
    pomodoriByCycle.value = 4

    const wrapper = mount(ProgressBar)
    expect(wrapper.text()).toEqual('⭕  🟥  🟥  🟥  🟨  🟥')
  })
  it('Display proper icons when there is a pomodoro done', () => {
    const { totalPomodoriDone } = storeToRefs(userStore)
    const { pomodoriByCycle, goal } = storeToRefs(parametersStore)

    goal.value = 5
    totalPomodoriDone.value = 1
    pomodoriByCycle.value = 4

    const wrapper = mount(ProgressBar)
    expect(wrapper.text()).toEqual('🟩  ⭕  🟥  🟥  🟨  🟥')
  })
  it('Display proper icons when the goal is reached', () => {
    const { totalPomodoriDone } = storeToRefs(userStore)
    const { pomodoriByCycle, goal } = storeToRefs(parametersStore)

    totalPomodoriDone.value = 4
    pomodoriByCycle.value = 4
    goal.value = 4

    const wrapper = mount(ProgressBar)
    expect(wrapper.text()).toEqual('🟩  🟩  🟩  🟩  🟩')
  })
  it('Display proper icons when there is a big break before the current total pomodori done', () => {
    const { totalPomodoriDone } = storeToRefs(userStore)
    const { pomodoriByCycle, goal } = storeToRefs(parametersStore)

    goal.value = 7
    totalPomodoriDone.value = 5
    pomodoriByCycle.value = 4

    const wrapper = mount(ProgressBar)
    expect(wrapper.text()).toEqual('🟩  🟩  🟩  🟩  🟨  🟩  ⭕  🟥')
  })
})
