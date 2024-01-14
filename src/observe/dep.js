import { watch } from "rollup"

let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  // 收集watcher
  depend(){
    // watcher 可以存放dep
    // 双向记忆
    Dep.target.addDep(this)
  }

  addSub(watcher){
    this.subs.push(watcher)
  }

  // 更新
  notify(){
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}

// add watcher
Dep.target = null
export function pushTarget(watcher){
  Dep.target = watcher
}

// cancel watcher
export function popTarget(){
  Dep.target = null
}

export default Dep