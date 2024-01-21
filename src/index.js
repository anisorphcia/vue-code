import { initGlobApi } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"
import { stateMixin } from "./initState"

function Vue(options){
    this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)   // 给 vm 添加 $nextTick
initGlobApi(Vue)

// 全局方法
// Vue.mixin

export default Vue