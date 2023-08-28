import ActionButton from '@/components/ActionButton'
import { mount } from '@vue/test-utils'

describe('Action Button', () => {
    it('Props are assigned properly', () => {
  
      let wrapper = shallowMount(ActionButton, {
        props: { enabled: false }
      });
  
      expect(wrapper.props('enabled')).toBe(false);
      expect(wrapper.props('action')).toBe(undefined);
  
      const testFunction = () => { return "test" };
      wrapper = shallowMount(ActionButton, {
        props: { action: testFunction }
      });
      expect(wrapper.props('enabled')).toBe(true);
      const action = wrapper.props('action');
      expect(action).toBe(testFunction);
      expect(action()).toBe("test");
      console.log(wrapper.html())
    })
    it('html is correct', () => {
      const slot = "<div>test</div>";
      let wrapper = mount(ActionButton, {
        slots: {
          default: slot
        }
      })
      expect(wrapper.html()).toContain(slot);
    })
  })