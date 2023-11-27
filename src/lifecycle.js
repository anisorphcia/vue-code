import { patch } from './vnode/patch'

export function mountComponent(vm, el) {
  // vm._render 将 render 变成vnode
  // vm._update 将 vnode 变成 真实 DOM
  vm._update(vm._render())
}

export function lifecycleMixin(Vue) {
<<<<<<< HEAD
    Vue.prototype._update = function (vnode) {
        let vm = this
        // old dom , vmode
        vm.$el = patch(vm.$el, vnode)
    }
}
=======
  Vue.prototype._update = function (vnode) {
    let vm = this
    // old dom , vmode
    vm.$el = patch(vm.$el, vnode)
    // console.log('vm', vm)
  }
}
>>>>>>> 7a3475f90b12711b48eddf08444ef9ea8ce2a36c
