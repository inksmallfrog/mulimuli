/*
* @Author: inksmallfrog
* @Date:   2017-04-21 15:33:41
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-21 16:38:46
*/

'use strict';
let MusicPage = function(view_config){
    this.config = view_config;

    this.bindControlsEvent();
}

MusicPage.prototype.bindControlsEvent = function(){
    $(this.config.controls.userInfoButtonSelector).bind('click', ()=>{
        if(module.user.user_info_available) module.user.show();
        else{
            let modal = new Modal({});
        }
    });
}