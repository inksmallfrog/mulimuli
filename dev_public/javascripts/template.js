/*
* @Author: inksmallfrog
* @Date:   2017-04-14 22:38:29
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-20 09:13:40
*/

'use strict';
let simpleERBTemplate = function(id){
    if(id.charAt(0) == '#'){
        id = id.substring(1, id.length);
    }
    let template_container = document.getElementById(id);
    let template = /^(textarea|input)$/i.test(template_container.nodeName) ? template_container.value : template_container.innerHTML;

    let pattern = /<%=(.*?)%>|<%(.*?)%>/g;
    let funcBody = "var temp='';temp += '";
    let index = 0;
    let escaper = /\\|'|\r|\n|\t|\u2028|\u2029|\s+/g;
    let escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\t':     't',
        '\u2028': 'u2028',
        '\u2029': 'u2029',
    };

    template.replace(pattern, (res, interpolate, evaluate, code_index) => {
        funcBody += template.slice(index, code_index).replace(escaper, (match) => {
            if(/\s+/.test(match)) return " ";
            return "\\" + escapes[match];
        }) //get normal HTML
        if(interpolate){
            funcBody += "'+" + interpolate + "+'";
        }
        else if(evaluate){
            funcBody += "';" + evaluate + "temp+='";
        }
        index = code_index + res.length;
        return res;
    });
    funcBody += "';return temp;";
    console.log(funcBody);
    return new Function("data", funcBody);
}

