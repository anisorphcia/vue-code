const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g     // {{}}

export function generate(el) {
    // 注意属性
    // _c 解析标签
    let children = genChildren(el)
    let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}${children ? `,${children}` : ''})`
    // let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}${
    //     children ? `,${children}` : ''
    //     })`
    console.log('code', code)
    // _c(div,{id: "app",style: {"color":" pink"," font-size":" 20px"}})
    return code
}

function genChildren(el) {
    // 处理子节点
    const children = el.children
    console.log('children', children)
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
}

function gen(node) {
    if (node.type === 1) {
        // 1 元素 div 
        return generate(node)
    } else {
        // 文本 or {{}}
        let text = node.text
        if (!defaultTagRE.test(text)) {
            // 解析文本
            return `_v(${JSON.stringify(text)})`
        }
        let tokens = []
        // 正则多次检测符合条件的字符串时，第二次会返回false，需要将lastIndex 置为 0
        let lastIndex = defaultTagRE.lastIndex = 0
        let match
        console.log('text', text)
        while (match = defaultTagRE.exec(text)) {
            console.log('match', match)
            let index = match.index
            if (index > lastIndex) {
                // 添加内容
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        console.log('index', lastIndex, text.length)
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        console.log('tokens', tokens)
        return `_v(${tokens.join('+')})`
    }
}

function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; ++i) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            // 行内样式
            // {id: app, style: {color: red, font-size: 20px}}
            // { "name": "style", "value": "color: pink; font-size: 20px;" }
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, val] = item.split(':')
                obj[key] = val
            })
            attr.value = obj
        }
        str += `${attr.name}: ${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}