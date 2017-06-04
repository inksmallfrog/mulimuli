/*
* @Author: inksmallfrog
* @Date:   2017-04-06 07:53:59
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-04 08:44:20
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
        let fly_content = $('.fly_send > input').val().trim();
        let currentMusicIndex = module.music_player.current_music_index;
        if(fly_content && currentMusicIndex > -1){
            $.ajax({
                url: "/bullets",
                type: "post",
                dataType: "json",
                data: {
                    text: fly_content,
                    musicId: module.music_player.musiclist[currentMusicIndex].id,
                    showtime: Math.ceil(module.music_player.music_view.currentTime)
                },
                success: ()=>{
                    $('.fly_send > input').val('');
                    module.music_player.addFlyToCanvas({content: fly_content});
                },
                error: (err) => {
                    alert('弹幕发送失败，请检查网络链接状况');
                },
            })
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
});