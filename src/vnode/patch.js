export function patch(oldNode, vnode) {

    // 第一次渲染 oldVnode 真实的dom
    if (oldNode.nodeType === 1) {
        // vnode -> real dom
        let el = createEl(vnode)
        // console.log('patch', el, oldNode)
        // 替换
        let parentEl = oldNode.parentNode
        parentEl.insertBefore(el, oldNode.nextsibling)
        parentEl.removeChild(oldNode)
        return el
    } else {
        // 两个虚拟 dom
        if (oldNode.tag !== vnode.tag) {
            // 1 两个元素不是一样的
            return oldNode.el.parentNode.replaceChild(createEl(vnode), oldNode.el)
        }
        if (!oldNode.tag) {
            if (oldNode.text !== vnode.text) {
                return oldNode.el.textContent = vnode.text
            }
        }
        let el = vnode.el = oldNode.el
        updateRpors(vnode, oldNode.data)
        // 处理子元素
        let oldChildren = oldNode.children || []
        let newChildren = vnode.children || []

        if (oldChildren.length > 0 && newChildren.length > 0) {
            // 1 old has child, new dose not have child
            updateChild(oldChildren, newChildren, el)
        } else if (newChildren.length > 0) {
            // 2 old does not have child, new has child
            el.innerHTML = ''
        } else if (oldChildren.length > 0) {
            // either of them have child
            el.appendChild(createEl(child))
        }
    }
}

function updateChild(oldChildren, newChildren, parent) {
    // dom 操作元素 
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[oldStartIndex]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0
    let newStartVnode = newChildren[newStartIndex]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]

    // 创建就元素的映射表
    function makeIndexByKey(child) {
        let map = {}
        child.forEach((item, index) => {
            if (item.key) {
                map[item.key] = index
            }
        })
        return map
    }
    let map = makeIndexByKey(oldChildren)

    function isSomeNode(oldContext, newContext) {
        return (oldContext.tag === newContext.tag) && (oldContext.key === newContext.key)
    }

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (isSomeNode(oldStartVnode, newStartVnode)) {
            console.log(1)
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else if (isSomeNode(oldEndVnode, newEndVnode)) {
            console.log(2)
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSomeNode(oldStartVnode, newEndVnode)) {
            console.log(3)
            patch(oldStartVnode, newEndVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSomeNode(oldEndVnode, newStartVnode)) {
            console.log(4)
            patch(oldEndVnode, newStartVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else {
            console.log(5)
            let moveIndex = map[newStartVnode.key]
            if (moveIndex == undefined) {
                parent.insertBefore(createEl(newStartVnode), oldStartVnode.el)
            } else {
                let moveVnode = oldChildren[moveIndex]
                oldChildren[moveIndex] = null
                parent.insertBefore(moveVnode.el, oldStartVnode.el)
                patch(moveVnode, newStartVnode)
            }
            newStartVnode = newChildren[++newStartIndex]
        }
    }

    // 添加多余的子节点
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i < newEndIndex; ++i) {
            parent.appendChild(createEl(newChildren[i]))
        }
    }

    if (oldStartIndex <= oldEndIndex) {
        for (let i = 0; i <= oldEndIndex; ++i) {
            let child = oldChildren[i]
            if (child != null) {
                parent.removeChild(child.el)
            }
        }
    }
}

function updateRpors(vnode, oldProps = {}) {
    let newProps = vnode.data || {}
    let el = vnode.el
    // old 存在属性, new 没有属性
    for (let key in oldProps) {
        if (!newProps[key]) {
            // delete
            el.removeAttribute(key)
        }
    }

    // 处理style
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style = ''
        }
    }

    // 处理 新的 
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}

export function createEl(vnode) {
    let { tag, children, key, data, text } = vnode
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        updateRpors(vnode)
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