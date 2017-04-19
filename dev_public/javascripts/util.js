/*
* @Author: inksmallfrog
* @Date:   2017-04-19 11:07:27
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-19 15:12:50
*/

'use strict';
function numFixed(num, length){
    var strNum = num + "";
    if(strNum.length > length) return strNum;
    else{
        for(var i = strNum.length; i < length; ++i){
            strNum = "0" + strNum;
        }
        return strNum;
    }
};

function seconds2m_s(value){
    if(typeof value != "number") value = Number.parseInt(value);
    else if(!Number.isInteger(value)) value = Math.floor(value);
    return numFixed(Math.floor(value / 60), 2) + ":" + numFixed(value % 60, 2)
}