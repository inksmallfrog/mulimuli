/*
* @Author: inksmallfrog
* @Date:   2017-04-06 07:53:59
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-19 16:49:50
*/

'use strict';
let music = $('audio')[0];
let track_timer;
let time_range;
let music_list;
let modes = ["repeat", "repeat_one", "shuffle"];

/*
used: $('.current_music')
 */
function bindCurrentMusicEvent(){
    let $current_music_page = $('.current_music');
    let reset_current_music = (id) => {
        //get music info by Ajax
    }
}

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
used: $('#music_favicon')
      music
      $current_music_page
 */
function bindMusicPageButtonEvent(){
    $('#music_favicon').bind('click', () => {
        if(!music.currentSrc) return;
        if(!$current_music_page.hasClass("show")) {
            $current_music_page.addClass("show");
            $current_music_page.removeAttr("aria-hidden");
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

function makeInitData(){
    localStorage.user_music = '[ \
                            {"id": 0, \
                             "src": "./uploads/music/38BEETS - さくらの季节.mp3", \
                             "title": "さくらの季节", \
                             "author": "38BEETS", \
                             "duration": "3:23"}, \
                            {"id": 1, \
                             "src": "./uploads/music/a_hisa - ほたる火.mp3", \
                             "title": "ほたる火", \
                             "author": "a_hisa", \
                             "duration": "5:30"}, \
                            {"id": 2, \
                             "src": "./uploads/music/Key Sounds Label - 鳥の詩 (short version).mp3", \
                             "title": "鳥の詩 (short version)", \
                             "author": "Key Sounds Label", \
                             "duration": "2:12"}\
                           ]';
    localStorage.music_index = 0;
}

$(document).ready(function(){
    makeInitData();
    let music_player_config = {
        audioSelector: '#music',
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
        timerangeSelector: '#time_range',
        timerangeTipSelector: '.time_bar_tip',
        currenttimeTipSelector: '#c_time',
        durationTipSelector: '#a_time',
        modeSelector: '#play_mode',
        musiclistToggleSelector: '.musiclist_control',
    }
    let music_player = new MusicPlayer(music_player_config);
    bindCurrentMusicEvent();
    bindFlySendEvent();
    bindMusicPageButtonEvent();
    bindFlyControlEvent();
});