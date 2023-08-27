import { shallowMount, mount } from '@vue/test-utils'
import App from '@/App.vue'
import ActionButton from '@/components/ActionButton'
import ProgressBar from '@/components/ProgressBar'

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
describe('Progress Bar', () => {
  it('Display correctly the progression', () => {
    let wrapper = mount(ProgressBar, {
      props: {
        goal: 0, 
        totalPomodoro: 0, 
        pomodoriByCycle: 0
      }
    });
    expect(wrapper.text()).toEqual("")
    /*wrapper = mount(ProgressBar, {
      props: {
        goal: 4, 
        totalPomodoro: 0, 
        pomodoriByCycle: 4
      }
    });
    expect(wrapper.text()).toEqual("⭕  🟨  🟨  🟨")*/
  })
})


describe('App.vue', () => {
  it('App mount properly', () => {
    let wrapper = shallowMount(App);
    // console.log(wrapper.html())
    // expect(wrapper.get['seconds']).toBe(null);
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
