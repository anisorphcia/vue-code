import { patch } from './vnode/patch'
import watcher from './observe/watcher'

export function mountComponent(vm, el) {
  // vm._render 将 render 变成vnode
  // vm._update 将 vnode 变成 真实 DOM
  callHook(vm, 'beforeMounted')
  // vm._update(vm._render())
  let updateComponent = () => {
    vm._update(vm._render())
  }
  new watcher(vm, updateComponent, () => {
    callHook(vm, 'updated')
  }, true)
  callHook(vm, 'mounted')
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    let vm = this
    // old dom , vmode
    vm.$el = patch(vm.$el, vnode)
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i < handlers.length; ++i) {
      handlers[i].call(this) // 改变生命周期中 this 的指向
    }
  }
}
