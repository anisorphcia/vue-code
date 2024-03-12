import { initGlobApi } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"
import { stateMixin } from "./initState"
import { compileToFunction } from "./compile/index"
import { createEl, patch } from "./vnode/patch"

function Vue(options) {
    this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)   // 给 vm 添加 $nextTick
initGlobApi(Vue)

// 创建 vnode
// let vm1 = new Vue({ data: { name: 'nakamoto' } })
// // let render1 = compileToFunction(`<div id="a" style="color: blue">{{name}}</div>`)
// let render1 = compileToFunction(`<ul>
// <li style="background: orange" key="e">e</li>
// <li style="background: red" key="a">a</li>
// <li style="background: pink" key="f">f</li>
// <li style="background: yellow" key="g">g</li>
//     <li style="background: green" key="b">b</li>
//     <li style="background: blue" key="c">c</li>
// </ul>`)
// let vnode1 = render1.call(vm1)
// document.body.appendChild(createEl(vnode1))

// let vm2 = new Vue({ data: { name: 'asakao' } })
// // let render2 = compileToFunction(`<div id="b" style="color: green">{{name}}</div>`)
// let render2 = compileToFunction(`<ul>
//     <li style="background: orange" key="e">e</li>
//     <li style="background: pink" key="f">f</li>
//     <li style="background: yellow" key="g">g</li>
//     <li style="background: aqua" key="h">h</li>
// </ul>`)
// // {/*
// //     <li style="background: red" key="a">a</li>
// //     <li style="background: green" key="b">b</li>
// //     <li style="background: blue" key="c">c</li> 
// // <li style="background: red" key="e">e</li>
// // <li style="background: green" key="f">f</li>
// // <li style="background: blue" key="g">g</li>
// // <li style="background: yellow" key="h">h</li> */}

// let vnode2 = render2.call(vm2)
// // patch 比对
// setTimeout(() => {
//     patch(vnode1, vnode2)
// }, 1000)


// 全局方法
// Vue.mixin

export default Vue