import { observer } from './observe/index'

export function initState(vm) {
  let opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  // data() 指向window
  // data.call(vm) 改变this指向
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 将data上的所有属性代理到实例上 vm {a:1, b:2}
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  // 数据劫持
  observer(data)
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    },
  })
}
