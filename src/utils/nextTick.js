let callback = []
let pending = false

function flush() {
  callback.forEach((cb) => cb())
  pending = false
}

let timerFunc
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flush)
  }
} else if (MutationObserver) {
  // h5 异步方法，可以监听 DOM 变化，监控完毕之后异步更新
  let observe = new MutationObserver(flush)
  let textNode = document.createTextNode(1)
  observe.observe(textNode, { characterData: true })
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flush)
  }
}
export function nextTick(cb) {
  console.log(cb)
  callback.push(cb)
  if (!pending) {
    timerFunc()
    pending = true
  }
}
