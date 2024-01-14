class Dep {
  constructor() {
    this.subs = []
  }
  // 收集watcher
  depend(){
    this.subs.push(Dep.target)
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