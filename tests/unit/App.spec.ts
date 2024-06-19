
import App from '@/App.vue'
import { DOMWrapper, mount } from '@vue/test-utils'
import StatistiquesBlock from '@/components/StatistiquesBlock.vue'
import { setActivePinia, createPinia } from 'pinia'

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('displays starting time with correct value', () => {
    const wrapper = mount(App)
    expect(wrapper.find('#timer').text()).toBe('25:00')
  })
  it('starts the timer when the "START" button is clicked', async () => {
    const wrapper = mount(App)
    expect(wrapper.find('#start-stop-button').text()).toContain('START')
    await wrapper.find('#start-stop-button').find('button').trigger('click')
    expect(wrapper.find('#start-stop-button').text()).toContain('STOP')
    setTimeout(async () => {
      expect(wrapper.find('#timer').text()).toBe('24:59')
      await wrapper.find('#start-stop-button').find('button').trigger('click')
      expect(wrapper.find('#start-stop-button').text()).toContain('START')
      setTimeout(async () => {
        expect(wrapper.find('#timer').text()).toBe('24:59')
      }, 1000)
    }, 1000)
  })
  it('goes to the next pomodoro when the "SKIP" button is clicked', async () => {
    const wrapper = mount(App)
    let stats: string = wrapper.findComponent(StatistiquesBlock).html()
    expect(stats).toMatch(/🍅(.|\n)*1 \/ 4(.|\n)*🎯(.|\n)*0/)

    const skipButton = wrapper.find('#skip-button').find('button')
    await skipButton.trigger('click')
    stats = wrapper.findComponent(StatistiquesBlock).html()
    expect(stats).toMatch(/🍅(.|\n)*1 \/ 4(.|\n)*🎯(.|\n)*1/)

    await skipButton.trigger('click')
    stats = wrapper.findComponent(StatistiquesBlock).html()
    expect(stats).toMatch(/🍅(.|\n)*2 \/ 4(.|\n)*🎯(.|\n)*1/)
    for (let i = 0; i < 6; i++) await skipButton.trigger('click') // case where a cycle has been completed
    stats = wrapper.findComponent(StatistiquesBlock).html()
    expect(stats).toMatch(/🍅(.|\n)*1 \/ 4(.|\n)*🎯(.|\n)*4/)
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
  it('resets when the "RESET" button is clicked', async () => {
    const wrapper = mount(App)
    const skipButton = wrapper.find('#skip-button').find('button')
    for (let i = 0; i < 10; i++) await skipButton.trigger('click') // case where a cycle has been completed
    await wrapper.find('#start-stop-button').find('button').trigger('click')
    setTimeout(async () => {
      await wrapper.find('#reset-button').find('button').trigger('click')
      const stats = wrapper.findComponent(StatistiquesBlock).html()
      expect(stats).toMatch(/🍅(.|\n)*1 \/ 4(.|\n)*🎯(.|\n)*0/)
      expect(wrapper.find('#timer').text()).toBe('25:00')
    }, 1000)
  })
  it('adds one minute when the ">" button is clicked', async () => {
    const wrapper = mount(App)
    await wrapper.find('#add-one-minute-button').find('button').trigger('click')
    expect(wrapper.find('#timer').text()).toBe('26:00')
  })
  it('removes one minute when the "<" button is clicked', async () => {
    const wrapper = mount(App)
    await wrapper.find('#remove-one-minute-button').find('button').trigger('click')
    expect(wrapper.find('#timer').text()).toBe('24:00')
  })
  async function isBlinking (element: DOMWrapper<Element>): Promise<boolean> {
    const blinkingBeforeWaiting = element.classes().includes('blink')
    await new Promise(resolve => setTimeout(resolve, 1000))
    const blinkingAfterWaiting = element.classes().includes('blink')
    return blinkingAfterWaiting !== blinkingBeforeWaiting
  }
  describe('Blinking', () => {
    it('blinks at the init of the application', async () => {
      const wrapper = mount(App)
      const timer = wrapper.find('#timer')
      expect(await isBlinking(timer)).toBe(true)
    })
    it('stops to blink when the start button is triggered', async () => {
      const wrapper = mount(App)
      const timer = wrapper.find('#timer')
      await wrapper.find('#start-stop-button').find('button').trigger('click')
      expect(await isBlinking(timer)).toBe(false)
    })
  })
})
