/*
* @Author: inksmallfrog
* @Date:   2017-04-21 09:09:32
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-21 16:11:28
*/

'use strict';
let User = function(view_config){
    this.config = view_config;
    this.appuser;
    this.logged = false;

    this.userInfoRenderFunc;
    this.userPlaylistRenderFunc;

    this.buildUserView();

    this.bindControlsEvent();

    this.loadUser();
}

User.prototype.loadUser = function(){
    let local_id = localStorage.t_id; //the local id for no logged user;
    $.ajax({
        url: "/appusers",
        dataType: "json",
        data: {
            t_id: local_id,
            askfor: "auth",
        },
        success: (data) => {
            if(data.user.state == "tempory"){
                if(!local_id) localStorage.t_id = data.log_id;
            }
            else if(data.user.state == "not verified"){
                //show dialog to check verified email
            }
            else{
                this.appuser = data.user;
                this.logged = true;
                this.bindUserData();
            }
        }
    });
}

User.prototype.show = function(){
    $(this.config.sectionSelector).removeClass('show');
}

User.prototype.bindUserData = function(){
    $(this.config.userDataSelector).html(this.userInfoRenderFunc(this.user));
    $(this.config.userPlaylistSelector).html(this.userPlaylistRenderFunc(this.user));
}

User.prototype.buildUserView = function(){
    if(!this.userInfoRenderFunc) this.userInfoRenderFunc = simpleERBTemplate(this.config.userInfoTemplateSelector);
    if(!this.userPlaylistRenderFunc) this.userPlaylistRenderFunc = simpleERBTemplate(this.config.userPlaylistTemplateSelector);
}

User.prototype.bindControlsEvent = function(){
    let controls = this.config.controls;
    $(controls.closeSelector).bind('click', () => {
        $(this.config.sectionSelector).removeClass('show');
    });
    $(controls.settingSelector).bind('click', ()=>{
        //show config page in iframe
    });
    $(controls.signSelector).bind('click', ()=>{
        //signed
    });
    $(controls.quitSelector).bind('click', ()=>{
        $.ajax({
            url: "/appusers",
            data: {
                askfor: "quit",
            },
            success: (data) => {
                this.user = {};
                this.user_info_available = false;
            }
        });
        $(this.config.sectionSelector).removeClass('show');
        this.user = null;
        this.user.type = "logout";
    });
    $(this.config.userPlaylistSelector).on('click', controls.gotoPlaylistSelector, (e)=>{
        let id = $(e.target).attr('data-id');
        //show platlist info in iframe;
    });
    $(this.config.userPlaylistSelector).on('click', controls.playPlaylistSelector, (e)=>{
        let id = $(e.target).parents().attr('data-id');
        //add playlist to musicplayer;
    })
}