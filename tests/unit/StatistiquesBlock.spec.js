import StatistiquesBlock from '@/components/StatistiquesBlock'
import { mount } from '@vue/test-utils'

describe('Goal statistique', () => {
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
    expect(wrapper.vm.goalStat).toBe("0");
    expect(goalPart(wrapper)).toBe(" 0");
  });
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
    expect(goalPart(wrapper)).toBe(" 0 / 1");
  });
  it('display goal when there is a goal set', () => {
    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 5, 
        currentPomoroNumber: 1,
        pomodoriByCycle: 4,
        goal: 4
      }
    });
    expect(wrapper.vm.goalStat).toBe("5 / 4");
    expect(goalPart(wrapper)).toBe(" 5 / 4");
  });
})

describe('Cycle statistique', () => {
  const cyclePart = (wrapper) => { return wrapper.text().split('🎯')[0].split('🍅')[1] };
  it('display cycle', () => {
    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 0, 
        currentPomoroNumber: 1,
        pomodoriByCycle: 4,
        goal: 0
      }
    });
    expect(wrapper.vm.cycleStat).toBe("1 / 4");
    expect(cyclePart(wrapper)).toBe(" 1 / 4 ");
  });
})