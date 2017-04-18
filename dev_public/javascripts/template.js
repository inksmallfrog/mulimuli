/*
* @Author: inksmallfrog
* @Date:   2017-04-14 22:38:29
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-15 08:51:44
*/

'use strict';
var simpleERBTemplate = function(id, data){
    var template_container = document.getElementById(id);
    var template = /^(textarea|input)$/i.test(template_container.nodeName) ? template_container.value : template_container.innerHTML;

    var pattern = /<%=(.*?)%>|<%(.*?)%>/g;
    var funcBody = "var temp='';temp += '";
    var index = 0;
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029|\s+/g;
    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\t':     't',
        '\u2028': 'u2028',
        '\u2029': 'u2029',
    };

    template.replace(pattern, function(res, interpolate, evaluate, code_index){
        funcBody += template.slice(index, code_index).replace(escaper, function(match){
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
    var templateFun = new Function("data", funcBody);
    return templateFun(data);
}

