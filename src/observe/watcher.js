import { popTarget, pushTarget } from './dep'

let id = 0
class watcher {
  constructor(vm, updateComponent, cb, options) {
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    this.id = id++
    this.deps = []  // watcher 存放 dep
    this.depsId = new Set()

    // 判断
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent // 更新视图
    }
    this.get()
  }

  addDep(dep){
    // 去重
    let id = dep.id
    if(!this.depsId.has(id)){
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }

  // 初次渲染
  get() {
    pushTarget(this) // add to dep
    this.getter() // 渲染页面
    popTarget() //pop
  }

  // 更新
  update() {
    this.getter()
  }
}

export default watcher
