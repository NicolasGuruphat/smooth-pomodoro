import App from '@/App.vue'


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