import StatistiquesBlock from '@/components/StatistiquesBlock'
import { mount } from '@vue/test-utils'

describe('Goal statistiques', () => {
  const goalPart = (wrapper) => { return wrapper.text().split('🎯')[1] };

  it('display nothing when there is no goal set', () => {

    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 0,
        goal: 0
      }
    });
    expect(goalPart(wrapper)).toBe("");
  })
  it('display goal when there is a goal set', () => {
    const wrapper = mount(StatistiquesBlock, {
      props: {
        totalPomodoriDone: 0, 
        goal: 1
      }
    });
    expect(goalPart(wrapper)).toBe(" /1");
  })
})