import { observer } from "./observe/index"

export function initState(vm){
    let opts = vm.$options
    if(opts.data){
        initData(vm)
    }
}

function initData(vm){
    let data = vm.$options.data
    // data() 指向window
    // data.call(vm) 改变this指向
    data = vm._data = typeof data === 'function' ? data.call(vm) : data
    // 数据劫持
    observer(data)   
}