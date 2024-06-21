import App from '@/App.vue'
import type { DOMWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { useUser } from '@/store/User'
import { useParameters } from '@/store/Parameters'
import { createPinia, setActivePinia } from 'pinia'

describe('Blinking', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const storeParameters = useParameters()
    storeParameters.reset()
    const storeUser = useUser()
    storeUser.reset()
  })
  async function isBlinking (element: DOMWrapper<Element>): Promise<boolean> {
    const blinkingBeforeWaiting = element.classes().includes('blink')
    await new Promise(resolve => setTimeout(resolve, 1000))
    const blinkingAfterWaiting = element.classes().includes('blink')
    return blinkingAfterWaiting !== blinkingBeforeWaiting
  }
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
