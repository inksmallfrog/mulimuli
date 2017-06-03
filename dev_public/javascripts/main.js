/*
* @Author: inksmallfrog
* @Date:   2017-04-06 07:53:59
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-03 23:08:42
*/

'use strict';
let music = $('audio')[0];
let track_timer;
let time_range;
let music_list;
let modes = ["repeat", "repeat_one", "shuffle"];

/*
used: $('.fly_send > button')
      $('.fly_send > input')
 */
function bindFlySendEvent(){
    $('.fly_send > button').bind('click', () => {
        if(/*!user.logged*/true){
            //showLogginModal()
        }
        let fly_content = $('.fly_send > input').value.trim();
        if(!fly_content){
            //showErr(flyError, "请输入字幕内容哟")
        }
        else{
            //send fly with ajax
            //insertFly(text);
        }
    });
}

/*
used: $('.switch')
      $('.fly_send')
 */
function bindFlyControlEvent(){
    let fly_on = localStorage.fly_state;
    fly_on = (fly_on === undefined) ? true : fly_on;
    $('.switch').on('click', () => {
        let switcher = $('.switch');
        if(fly_on){
            switcher.removeClass('on').addClass('off');
            switcher.children('p').html('OFF');
            $('.fly_send').slideToggle("fast");
            fly_on = false;
            localStorage.fly_state = false;
            //clear all flys
        }
        else{
            switcher.removeClass('off').addClass('on');
            switcher.children('p').html('ON');
            $('.fly_send').slideToggle("fast");
            fly_on = true;
            localStorage.fly_state = true;
        }
    });
}

$(document).ready(function(){
    let music_player_config = {
        audioSelector: '#music',
        currentPage: {
            coverSelector: '.music_cover img',
            fliesCanvasSelector: '#flies_canvas',
        },
        control: {
            controlItemSelector: '.control_item',
            playorpauseSelector: '#playorpause',
            previousSelector: '#previous',
            nextSelector: '#next'
        },
        musiclist: {
            templateSelector: '#music_template',
            ulSelector: '.music_ul',
            itemSelector: '.music_item',
            closeSelector: '.musiclist .close',
            deleteButtonSelector: '.music_item > .delete',
            divSelector: '.musiclist',
            headerTitleSelector: '.musiclist > .header > .title',
        },
        volume: {
            controlSelector: '.volume_control',
            rangeSelector: '#volume_range',
        },
        flySend: '.fly_send',
        musicFaviconSelector: '#music_favicon img',
        timerangeSelector: '#time_range',
        timerangeTipSelector: '.time_bar_tip',
        currenttimeTipSelector: '#c_time',
        durationTipSelector: '#a_time',
        modeSelector: '#play_mode',
        flyControl: '.switch',
        musiclistToggleSelector: '.musiclist_control',
    };
    let user_config = {
        sectionSelector: '.user_section',
        userDataSelector: '.user_data',
        userPlaylistSelector: '.user_playlist',
        userInfoTemplateSelector: '#user_template',
        userPlaylistTemplateSelector: '#user_playlist_template',
        controls:{
            closeSelector: '.user_data .close',
            settingSelector: '.user_data .user_icon',
            signSelector: '.daily_sign',
            quitSelector: '.user_data .quit',
            gotoPlaylistSelector: '.user_playlists li',
            playPlaylistSelector: '.playlist_info span',
        },
    };
    let music_page_config = {
        sectionSelector: '.music_page',
        controls: {
            userInfoButtonSelector: '#show_user_info',
        },
    }
    module.music_player = new MusicPlayer(music_player_config);
    module.user = new User(user_config);
    module.music_page = new MusicPage(music_page_config);

    $(window).bind('resize', ()=>{
        module.music_player.resize($(window).width(), $(window).height());
    });
    bindFlySendEvent();
    bindFlyControlEvent();
});