let intervalId

self.onmessage = function (e) {
  if (e.data === 'start') {
    let i = 0
    intervalId = setInterval(() => {
      if (i % 2) {
        self.postMessage('tick')
      } else {
        self.postMessage('tack')
      }
      i++
    }, 1000)
  } else if (e.data === 'stop') {
    clearInterval(intervalId)
  }
}
