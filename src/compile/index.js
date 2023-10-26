import { generate } from "./generate";
import { parseHTML } from "./parseAst";


export function compileToFunction(el) {
    // html to ast 
    let ast = parseHTML(el)
    // ast 语法树 -> render 函数
    let code = generate(ast)
}


/**
 *     <div id="app">hello {{ msg }}</div>
 * 
 {
    "tag": "div",
    "attrs": [
        {
            "name": "id",
            "value": "app"
        }
    ],
    "children": [
        {
            "type": 3,
            "text": "hello {{ mg }}"
        }
    ],
    "type": 1,
    "parent": null
}
 */