/*
* @Author: inksmallfrog
* @Date:   2017-04-06 07:53:59
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-14 19:36:56
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

localStorage.user_music = '[{"src": "./test.mp3"},{"src": "./test1.mp3"},{"src": "./test2.mp3"}]';
localStorage.current_index = 0;

$(document).ready(function(){
    var current_music_page = $('.current_music');

    var modes = ["loop", "infinite", "shuffle"];
    //music
    var music = $('audio')[0];
    var refreshTimeTip = function(){
        var time = music.currentTime;
        $("#c_time").html(numFixed(Math.floor(time / 60), 2) + ":" + numFixed(Math.floor(time) % 60, 2));
    }
    var pertime = function(){
        time_range.pointto(music.currentTime, false)
        refreshTimeTip();
    }
    var track_timer = null;
    $(music).bind('progress', function(){
        if(this.buffered.length < 1) return;
        console.log(this.buffered.end(0) + ":" + this.duration);
        $('.loaded_line').css('width', (this.buffered.end(0) / this.duration) * 100 + "%");
    }).bind('stalled', function(){
        $('#playorpause').attr("disabled",true);
        $('#previous').attr("disabled",true);
        $('#next').attr("disabled",true);
    }).bind('loadedmetadata', function(){
        time_range.maxValue = this.duration;
        $('#a_time').html("/ " + numFixed(Math.floor(this.duration / 60), 2) + ":" + numFixed(Math.floor(this.duration) % 60, 2));
    }).bind('ended', function(){
        music_list.autoNext();
    }).bind('canplay', function(){
        $('#playorpause').removeAttr("disabled");
        $('#previous').removeAttr("disabled");
        $('#next').removeAttr("disabled");
    }).bind('play', function(){
        track_timer = setInterval(pertime, 1000);
        $('#playorpause > span').attr("class", "icon-pause");
    }).bind('pause', function(){
        clearInterval(track_timer);
        $('#playorpause > span').attr("class", "icon-play");
    })
    //music_list
    var onmusiclist_dataready = function(current_music, play_mode){
        if(current_music){
            music.src = current_music.src;
        }
        $('.play_mode > span').attr('class', 'icon-'+modes[play_mode]);
    }
    var onmusic_change = function(current_music){
        if(current_music){
            music.pause();
            clearInterval(track_timer);
            music.src = current_music.src;
            time_range.pointto(0);
            try{
                music.play();
            }
            catch(e){

            }
            track_timer = setInterval(pertime, 1000);
        }
    };
    var music_list = new MusicList('#music_list', onmusiclist_dataready, onmusic_change);

    //fly-send
    $('.fly > button').on('click', function(){
        if(/*!user.logged*/true){
            //showLogginModal()
        }
        var fly_content = $('.fly > input').value.trim();
        if(!fly_content){
            //showErr(flyError, "请输入字幕内容哟")
        }
        else{
            //send fly with ajax
            //insertFly(text);
        }
    });

    //control-panel icon
    $('#music_favicon').on('click', function(){
        if(!music.currentSrc) return;
        if(!current_music_page.hasClass("show")) {
            current_music_page.addClass("show");
            current_music_page.attr("aria-hidden", "false");
        }
    });
    $('#previous').on('click', function(){
        music_list.previous();
    });
    $('#playorpause').on('click', function(){music.paused ? music.play() : music.pause();});
    $('#next').on('click', function(){
        music_list.next();
    });

    //time_range
    var time_range_tip = $('.time_bar_tip');
    var time_range_tip_text = time_range_tip.children("p");
    var ontimechange = function (e, seconds){
        music.currentTime = seconds;
        refreshTimeTip();
    }
    var show_time_tip = function(e, value, pos, pageX){
        var time = value;
        if(time < 0) time = 0;
        var time_text = numFixed(Math.floor(time / 60), 2) + ":" + numFixed((time % 60), 2);
        time_range_tip_text.html(time_text);
        time_range_tip.css("left", (pageX - $(".control-panel").offset().left - time_range_tip.width() / 2) + "px");
        time_range_tip.show();
    }
    var hide_time_tip = function(e){
        time_range_tip.hide();
    }
    var time_range = new Rangebar("#time_range", 120, 0, ontimechange, show_time_tip, hide_time_tip);

    //fly
    var fly_on = localStorage.fly_state;
    fly_on = (fly_on === undefined) ? true : fly_on;
    $('.switch').on('click', function(){
        var switcher = $(this);
        if(fly_on){
            switcher.removeClass('on').addClass('off');
            switcher.children('p').html('OFF');
            $('.fly').slideToggle("fast");
            fly_on = false;
            localStorage.fly_state = false;
            //clear all flys
        }
        else{
            switcher.removeClass('off').addClass('on');
            switcher.children('p').html('ON');
            $('.fly').slideToggle("fast");
            fly_on = true;
            localStorage.fly_state = true;
        }
    });

    //playmode
    $('.play_mode').on('click', function(){
        music_list.play_mode = (music_list.play_mode + 1) % 3;
        var mode_num = music_list.play_mode;
        mode_num = mode_num > 2 ? 0 : mode_num;
        $(this).children("span").attr('class', 'icon-'+modes[mode_num]);
        localStorage.play_mode = mode_num;
    });

    //volume_range
    var volume_control_icon = $('.volume_control > span');
    var volume_before_blocked = -1;
    var user_volume = localStorage.volume ? localStorage.volume : 100;
    var refresh_volume_control_icon = function(value){
        if(value == 0) volume_control_icon.attr("class", "icon-volume-mute");
        else if(value <= 33) volume_control_icon.attr("class", "icon-volume-low");
        else if(value <= 66) volume_control_icon.attr("class", "icon-volume-medium");
        else volume_control_icon.attr("class", "icon-volume-high");
    }
    var onvolumechange = function (e, value){
        if(volume_before_blocked == -1){
            music.volume = value / 100;
            refresh_volume_control_icon(value);
        }
        else{
            volume_before_blocked = value / 100;
        }
        localStorage.volume = value;
    }
    var volume_range = new Rangebar("#volume_range", 100, user_volume, onvolumechange)
    $('.volume_control').bind('click', function(){
        if(volume_before_blocked == -1) {
            volume_before_blocked = music.volume;
            music.volume = 0;
            volume_control_icon.attr("class", "icon-volume-blocked");
        }
        else{
            music.volume = volume_before_blocked;
            refresh_volume_control_icon(volume_before_blocked * 100);
            volume_before_blocked = -1;
        }
    })

    var hide_music_list = function(music_list_view){
        music_list_view.animate({
            height: 0,
            width: 0
        }, 500, function(){
            music_list_view.hide();
            this.setAttribute("aria-hidden", "true");
        });
    }
    var show_music_list = function(music_list_view){
        music_list_view.show();
        music_list_view.animate({
            height: "400px",
            width: "800px"
        }, 500, function(){
            this.setAttribute("aria-hidden", "false");
        });
    }
    $('.music_list .close').bind('click', function(){
        hide_music_list($('.music_list'));
    })
    $('.music_list_control').bind('click',function(){
        var music_list_view = $('.music_list');
        if(music_list_view.attr("aria-hidden") == "true"){
            show_music_list(music_list_view);
        }
        else{
            hide_music_list(music_list_view);
        }
    });
});