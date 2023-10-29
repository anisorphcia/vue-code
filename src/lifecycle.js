export function mountComponent(vm, el) {
    // vm._render 将 render 变成vnode 
    // vm._update 将 vnode 变成 真实 DOM
    vm._update(vm._render())

}

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (node) {

    }
}