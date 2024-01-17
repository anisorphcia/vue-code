// 获取数组的方法
let oldArrayProtoMethods = Array.prototype
// console.log('oldArrayProtoMethods', oldArrayProtoMethods)
// 继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)
// console.log('ArrayMethods', ArrayMethods)
// 劫持
let methods = ['push', 'pop', 'unshift', 'shift', 'splice']

methods.forEach((item) => {
  ArrayMethods[item] = function (...args) {
    let result = oldArrayProtoMethods[item].apply(this, args) // this -> list:[]
    // 对添加的数组对象进行劫持
    let inserted
    switch (item) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.splice(2)
        break
    }
    // this -> value
    let ob = this.__ob__
    if (inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify() // 通知数组进行更新
    return result
  }
})
