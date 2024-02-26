import { popTarget, pushTarget } from './dep'
import { nextTick } from '../utils/nextTick'

let id = 0
class watcher {
  constructor(vm, updateComponent, cb, options) {
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    this.user = !!options.user
    this.id = id++
    this.deps = [] // watcher 存放 dep
    this.depsId = new Set()

    // 判断
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent // 更新视图
    } else {
      // string
      this.getter = function () {
        let path = updateComponent.split('.')
        let obj = vm
        for (let i = 0; i < path.length; ++i) {
          obj = obj[path[i]]
        }
        return obj
      }
    }
    this.value = this.get() // 保存watch的初始值

  }

  addDep(dep) {
    // 去重
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }

  run() {
    let value = this.get() // new value
    let oldValue = this.value
    this.value = value
    if (this.user) {
      this.cb.call(this.vm, value, oldValue)
    }
  }

  // 初次渲染
  get() {
    pushTarget(this) // add to dep
    const value = this.getter() // 渲染页面
    popTarget() //pop
    return value
  }

  // 更新
  update() {
    // 数据更新后会调用 get 方法，所以需要缓存更新数据
    // this.get()
    queueWatcher(this)
  }
}

let queue = []
let has = {}
let pending = false
function flushWatcher() {
  queue.forEach((item) => {
    item.run()
    // item.cb()
  })
  queue = []
  has = {}
  pending = false
}
function queueWatcher(watcher) {
  let id = watcher.id // 每个组件都是同一个id
  // 防抖 == 和 === 有区别
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      // 异步
      // setTimeout(() => {
      //   queue.forEach(item => item.run())
      //   queue = []
      //   has = {}
      //   pending = false
      // }, 0)
      nextTick(flushWatcher)
    }
    pending = true
  }
}

export default watcher
