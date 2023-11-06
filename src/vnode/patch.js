export function patch(oldNode, vnode) {
    // vnode -> real dom
    let el = createEl(vnode)
    console.log('patch', el, oldNode)
    // 替换
    let parentEl = oldNode.parentNode
    parentEl.insertBefore(el, oldNode.nextsibling)
    parentEl.removeChild(oldNode)
    return el
}

function createEl(vnode) {
    let { tag, children, key, data, text } = vnode
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        if (children.length > 0) {
            children.forEach(child => {
                vnode.el.appendChild(createEl(child))
            })
        }
    } else {
        // text
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

// vue 的渲染流程
/**
 * 1.数据初始化
 * 2.对模板进行编译
 * 3.变成render函数
 * 4.通过render函数变成 真实dom 放到页面
 */