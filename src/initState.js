import { observer } from "./observe/index"
import { nextTick } from "./utils/nextTick"

export function initState(vm) {
    let opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}

function initData(vm) {
    let data = vm.$options.data
    // data() 指向window
    // data.call(vm) 改变this指向
    data = vm._data = typeof data === 'function' ? data.call(vm) : data
    // 将data上的所有属性代理到实例上 vm {a:1, b:2}
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    // 数据劫持
    observer(data)
}

function initWatch(vm) {
    let watch = vm.$options.watch
    // 遍历
    for(let key in watch){
        let handler = watch[key]
        if(Array.isArray(handler)){
            // 数组
            handler.forEach(item => {
                createrWatcher(vm, key, item)
            })
        }else{
            // 对象，字符，函数
            createrWatcher(vm, key, handler)
        }
    }
}

function createrWatcher(vm, exprOrfn, handler, options){
    // 处理handler
    if(typeof handler === 'object'){
        options = handler
        handler = handler.handler
    }
    if(typeof handler === 'string'){
        handler = vm[handler]
    }
    return vm.$watch(exprOrfn, handler, options)
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}

export function stateMixin(vm) {
    vm.prototype.$nextTick = function (cb) {
        // nextTick 数据更新后获取到最新的 dom
        nextTick(cb)
    }
    vm.prototype.$watch = function(exprOrfn, handler, options) {
        // console.log(exprOrfn, handler, options)
        
    }
}