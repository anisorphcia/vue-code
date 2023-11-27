export const HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestory',
    'destroyed'
]

// 策略模式
let states = {}
states.data = function () { }
states.computed = function () { }
states.watch = function () { }
states.methods = function () { }
// 便利生命周期
HOOKS.forEach(hook => {
    states[hook] = mergeHook
})

function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal)
        } else {
            return [childVal]
        }
    } else {
        return parentVal
    }
}

export function mergeOptions(parent, child) {
    console.log('utils', parent, child)
    const options = {}
    for (let key in parent) {
        mergeFiled(key)
    }
    for (let key in child) {
        mergeFiled(key)
    }
    function mergeFiled(key) {
        if (states[key]) {
            options[key] = states[key](parent[key], child[key])
        } else {
            options[key] = child[key]
        }
    }
    console.log('options', options)
    return options
}