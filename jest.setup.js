/**
 * JSDOM does not implement global "open" function
 */
// eslint-disable-next-line no-undef
HTMLMediaElement.prototype.play = jest.fn()
