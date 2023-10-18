// 获取数组的方法
let oldArrayProtoMethods = Array.prototype
console.log('oldArrayProtoMethods', oldArrayProtoMethods)
// 继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)
console.log('ArrayMethods', ArrayMethods)
// 劫持
let methods = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice"
]

methods.forEach(item => {
    console.log('ArrayMethods[item]', ArrayMethods[item])
    ArrayMethods[item] = function(...args){
        console.log('劫持数组')
       let result = oldArrayProtoMethods[item].apply(this, args) // this -> list:[]
       return result
    }
})
