import { initState } from "./initState"

export function initMixin(Vue){
    Vue.prototype._init = function(options){
        console.log('this', this)
        console.log('options', options)
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
        let options = vm.$options
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                // get html
                el = el.outerHTML
                console.log(el)
            }
        }
    }
}

