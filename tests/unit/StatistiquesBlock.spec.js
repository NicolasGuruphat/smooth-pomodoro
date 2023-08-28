import StatistiquesBlock from '@/components/StatistiquesBlock'
import { mount } from '@vue/test-utils'

describe('Goal statistiques', () => {
  const goalPart = (wrapper) => { return wrapper.text().split('🎯')[1] };

  it('display nothing when there is no goal set', () => {

    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 0, 
        currentPomoroNumber: 0,
        pomodoriByCycle: 4,
        goal: 0
      }
    });
    expect(wrapper.vm.goalStat).toBe("0 / ");
  })
  it('display goal when there is a goal set', () => {
    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 0, 
        currentPomoroNumber: 1,
        pomodoriByCycle: 4,
        goal: 1
      }
    });
    expect(wrapper.vm.goalStat).toBe("0 / 1");
  })
})