import { ArrayMethods } from './arr'
import Dep from './dep'

export function observer(data) {
  if (typeof data !== 'object' || data === null) {
    return data
  }
  return new Observer(data)
}

class Observer {
  constructor(value) {
    // 给data定义一个属性
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      configurable: false, // 控制属性秒舒服是否能改变
      value: this,
    })
    this.dep = new Dep() // 给所有对象类型增加一个 dep
    if (Array.isArray(value)) {
      value.__proto__ = ArrayMethods
      // 数组中的元素是对象
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value)
    }
  }
  observeArray(value) {
    // value.forEach(el => {
    //     observer(el)
    // })
    for (let i = 0; i < value.length; ++i) {
      observer(value[i])
    }
  }
}

// 只能对对象中的属性劫持，无法操作数组
function defineReactive(data, key, value) {
  let childDep = observer(value)
  // console.log('childDep', observer(value))
  let dep = new Dep() // 给每一个属性都添加一个dep
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend()
        if (childDep.dep) {
          childDep.dep.depend() // 数组收集
        }
      }
      // console.log('dev', dep)
      return value
    },
    set(newValue) {
      if (newValue === value) return
      value = newValue
      dep.notify()
    },
  })
}
