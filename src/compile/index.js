const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z$]*`      // 标签名称 span div
const qnameCapture = `((?:${ncname}\\:)?${ncname})`     // <span:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`)        // 标签开头的正则
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)     // 匹配标签结尾
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 属性
const startTagClose = /^\s*(\/?)>/          // 匹配结束标签
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g     // {{}}

// const doctype = /^]+>/i
// const comment = /^<!–/
// const conditionalComment = /^<![/

function createAstElement(tag, attrs) {
    return {
        tag,
        attrs,
        children: [],
        type: 1,
        parent: null
    }
}

let root
let createParent
let stack = []

function start(tag, attrs) {
    let element = createAstElement(tag, attrs)
    if (!root) {
        root = element
    }
    createParent = element
    stack.push(element)
}

function charts(text) {
    text = text.replace(/s/g, '')   // 去掉空格
    if(text){
        createParent.children.push({
            type: 3,
            text
        })
    }
}

function end(tag) {
    let element = stack.pop()
    createParent = stack[stack.length - 1]
    if (createParent) {
        element.parent = createParent.tag
        createParent.children.push(element)
    }
}



function parseHTML(html) {
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            // start tag
            const startTagMatch = parseStartTag()   // 开始标签的内容
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                console.log('startTagMatch', startTagMatch)
                continue
            }
            // end tag
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                console.log('endTag', endTagMatch)
                continue
            }
        }
        let text
        if (textEnd > 0) {
            // 处理文本
            text = html.substring(0, textEnd)
            console.log(text)   // hello {{ msg }}
        }
        if (text) {
            advance(text.length)
            charts(text)
        }
    }

    // <div id="app">hello</div>
    function parseStartTag() {
        const start = html.match(startTagOpen) // 1 result 2 false
        if (start) {
            let match = {
                tagName: start[1],
                attrs: []
            }
            // 删除 开始标签 <div
            advance(start[0].length)
            // 获取属性  id = app
            // 注意多属性的情况
            let attr
            let end
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
                return match
            }
        }
    }

    function advance(n) {
        html = html.substring(n)    // 删除后的字符串 id="app">hello</div>
    }
    console.log('root', root)
    return root
}


export function compileToFunction(el) {
    let ast = parseHTML(el)
}