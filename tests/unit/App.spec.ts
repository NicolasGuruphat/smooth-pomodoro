
import App from '@/App.vue'
import { mount } from '@vue/test-utils'
import StatistiquesBlock from '@/components/StatistiquesBlock.vue'
describe('App', () => {
  it('displays starting time with correct value', () => {
    const wrapper = mount(App)
    expect(wrapper.find('#timer').text()).toBe('25:00')
  })
  it('starts the timer when the "START" button is clicked and resets the timer when the "RESET" button is clicked', async () => {
    const wrapper = mount(App)
    await wrapper.find('#start-stop-button').find('button').trigger('click')
    setTimeout(async () => {
      expect(wrapper.find('#timer').text()).toBe('24:59')
      await wrapper.find('#reset-button').find('button').trigger('click')
      expect(wrapper.find('#timer').text()).toBe('25:00')
    }, 1000)
  })
  it('goes to the next pomodoro when the "SKIP" button is clicked and reset the stats when the "RESET" button is clicked', async () => {
    const wrapper = mount(App)
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

    await wrapper.find('#reset-button').find('button').trigger('click')
    stats = wrapper.findComponent(StatistiquesBlock).html()
    expect(stats).toMatch(/🍅(.|\n)*1 \/ 4(.|\n)*🎯(.|\n)*0/)
  })
  it('goes to the first pomodoro of the cycle when the "->1st" button is clicked', async () => {
    const wrapper = mount(App)
    const skipButton = wrapper.find('#skip-button').find('button')

    await skipButton.trigger('click')
    await skipButton.trigger('click')

    await wrapper.find('#go-to-first-button').find('button').trigger('click')
    let stats = wrapper.findComponent(StatistiquesBlock).html()
    expect(stats).toMatch(/🍅(.|\n)*1 \/ 4(.|\n)*🎯(.|\n)*0/)

    for (let i = 0; i < 10; i++) await skipButton.trigger('click') // case where a cycle has been completed
    await wrapper.find('#go-to-first-button').find('button').trigger('click')
    stats = wrapper.findComponent(StatistiquesBlock).html()
    expect(stats).toMatch(/🍅(.|\n)*1 \/ 4(.|\n)*🎯(.|\n)*4/)
  })
})
