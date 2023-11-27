<<<<<<< HEAD
import { initGlobApi } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"
=======
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vnode/index'
>>>>>>> 7a3475f90b12711b48eddf08444ef9ea8ce2a36c

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
<<<<<<< HEAD
initGlobApi(Vue)

// 全局方法
// Vue.mixin

export default Vue
=======
export default Vue
>>>>>>> 7a3475f90b12711b48eddf08444ef9ea8ce2a36c
