import { initState } from "./initState"
import { compileToFunction } from './compile/index'
import { mountComponent } from "./lifecycle"

export function initMixin(Vue){
    Vue.prototype._init = function(options){
        let vm = this
        vm.$options = options
        // init
        initState(vm)
        // 渲染模板 el
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function(el){
        let vm = this
        el = document.querySelector(el)
        vm.$el = el
        let options = vm.$options
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                // get html
                el = el.outerHTML

                // transfer to ast tree
                let render = compileToFunction(el)
                console.log('ast', render)

                // 将 render 函数变成 vnode
                // 将 vnode 变成真实 DOM 放到页面
                options.render = render
            }
        }
        mountComponent(vm, el)
    }
}

