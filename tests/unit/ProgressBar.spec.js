import ProgressBar from '@/components/ProgressBar'
import { mount } from '@vue/test-utils'

describe('Progress Bar', () => {
    it('Display correctly the progression bar icons', () => {
      let wrapper = mount(ProgressBar, {
        props: {
          goal: 0,
          totalPomodoriDone: 0,
          pomodoriByCycle: 0
        }
      });
      expect(wrapper.text()).toEqual("")
      wrapper = mount(ProgressBar, {
        props: {
          goal: 4,
          totalPomodoriDone: 0,
          pomodoriByCycle: 4
        }
      });
      expect(wrapper.text()).toEqual("⭕  🟥  🟥  🟥");
      wrapper = mount(ProgressBar, {
        props: {
          goal: 5,
          totalPomodoriDone: 0,
          pomodoriByCycle: 4
        }
      });
      expect(wrapper.text()).toEqual("⭕  🟥  🟥  🟥  🟨  🟥");
      wrapper = mount(ProgressBar, {
        props: {
          goal: 5,
          totalPomodoriDone: 1,
          pomodoriByCycle: 4
        }
      });
      expect(wrapper.text()).toEqual("🟩  ⭕  🟥  🟥  🟨  🟥");
      wrapper = mount(ProgressBar, {
        props: {
          goal: 4,
          totalPomodoriDone: 4,
          pomodoriByCycle: 4
        }
      });
      expect(wrapper.text()).toEqual("🟩  🟩  🟩  🟩  🟩");
      wrapper = mount(ProgressBar, {
        props: {
          goal: 7,
          totalPomodoriDone: 5,
          pomodoriByCycle: 4
        }
      });
      expect(wrapper.text()).toEqual("🟩  🟩  🟩  🟩  🟨  🟩  ⭕  🟥");
    })
  })