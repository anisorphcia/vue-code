import { ArrayMethods } from './arr'

export function observer(data){
    if(typeof data !== 'object' || data === null){
        return data;
    }
    return new Observer(data)
}

class Observer{
    constructor(value){
        // 给data定义一个属性
        Object.defineProperty(value, '__ob__', {
            enumerable: false,
            value: this
        })
        if (Array.isArray(value)){
            value.__proto__ = ArrayMethods
            // 数组中的元素是对象
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }
    walk(data){
        let keys = Object.keys(data)
        for(let i = 0; i < keys.length; ++i){
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value)
        }
    }
    observeArray(value){
        // value.forEach(el => {
        //     observer(el)
        // })
        for(let i = 0; i < value.length; ++i){
            observer(value[i])
        }
    }
}

// 只能对对象中的属性劫持，无法操作数组
function defineReactive(data, key, value){
    observer(value)
    Object.defineProperty(data, key, {
        get(){
            return value
        },
        set(newValue){
            if(newValue === value) return
            value = newValue
        }
    })
}