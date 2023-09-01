
import App from '@/App.vue'
import { mount } from '@vue/test-utils'
import StatistiquesBlock from '@/components/StatistiquesBlock.vue'
describe('App', () => {
  it('displays starting time with correct value', () => {
    const wrapper = mount(App)
    expect(wrapper.find('#timer').text()).toBe('25:00')
  })
  it('starts when the start button is clicked', async () => {
    const wrapper = mount(App)
    await wrapper.find('#start-stop-button').find('button').trigger('click')
    setTimeout(() => { expect(wrapper.find('#timer').text()).toBe('24:59') }, 1000)
  })
  it('goes to the next pomodoro when the "SKIP" button is clicked', async () => {
    const wrapper = mount(App)
    // wrapper?.currentPomodoroNumber = 1
    // wrapper.setData({ currentPomodoroNumber: 1 })
    let stats : string = wrapper.findComponent(StatistiquesBlock).html()
    console.log(stats)
    expect(stats).toMatch(/🍅(.|\n)*1 \/ 4(.|\n)*🎯(.|\n)*0/)

    const skipButton = wrapper.find('#skip-button').find('button')
    await skipButton.trigger('click')

    stats = wrapper.findComponent(StatistiquesBlock).html()
    expect(stats).toMatch(/🍅(.|\n)*1 \/ 4(.|\n)*🎯(.|\n)*1/)

    await skipButton.trigger('click')

    stats = wrapper.findComponent(StatistiquesBlock).html()
    expect(stats).toMatch(/🍅(.|\n)*2 \/ 4(.|\n)*🎯(.|\n)*1/)
  })
})

// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message'
//     const wrapper = shallowMount(HelloWorld, {
//       props: { msg }
//     })
//     expect(wrapper.text()).toMatch(msg)
//   })
// })
