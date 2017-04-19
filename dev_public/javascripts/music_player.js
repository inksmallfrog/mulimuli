/*
* @Author: inksmallfrog
* @Date:   2017-04-19 10:26:24
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-19 17:06:44
*/

'use strict';

let MusicPlayer = function(view_config){
    this.view_config = view_config;

    this.askToPlay = false;

    this.play_mode = 0;
    this.musiclist = [];
    this.played_history = [];
    this.played_history_pos = 0;
    this.max_history_size = 40;
    this.current_music_index = -1;

    this.listRenderFunc;

    this.music_view = $(view_config.audioSelector)[0];
    this.timer;

    this.modes = ["repeat", "repeat_one", "shuffle"];

    this.volume_before_blocked = -1;

    //this jQueryObject is used in the internal callback
    //prepare calculating it for high performance
    this.$currenttime_tip_view = $(view_config.currenttimeTipSelector);

    this.buildMusiclist();
    this.buildTimerange();
    this.buildVolumerange();

    this.bindMusicEvents();
    this.bindControlEvents();
    this.bindModeEvents();
    this.bindMusicListToggleEvents();

    this.loadMusiclist();
    this.loadConfigs();

}
MusicPlayer.prototype.bindDuration = function(){
    let $duration_tip_view = $(this.view_config.durationTipSelector);
    const duration = this.music_view.duration;
    this.timerange.maxValue = duration;
    $duration_tip_view.html("/ " + seconds2m_s(duration));
}
MusicPlayer.prototype.refreshCurrentTime = function(){
    this.$currenttime_tip_view.html(seconds2m_s(this.music_view.currentTime));
}
MusicPlayer.prototype.startTimer = function(){
    const NO_CALLBACK = false;
    this.timerange.pointTo(this.music_view.currentTime, NO_CALLBACK);
    this.refreshCurrentTime();
    this.timer = setInterval(() => {
        this.timerange.pointTo(this.music_view.currentTime, NO_CALLBACK);
        this.refreshCurrentTime();
    }, 1000);
}
MusicPlayer.prototype.stopTimer = function(){
    clearInterval(this.timer);
}
MusicPlayer.prototype.bindMusicEvents = function(){
    let $music_view = $(this.music_view);
    $music_view.bind('progress', () => {
        if(this.music_view.buffered.length < 1) return;
        this.timerange.loadedTo(this.music_view.buffered.end(0));
    }).bind('loadedmetadata', () => {
        this.bindDuration();
    }).bind('ended', () => {
        this.next();
    }).bind('canplay', () => {
        if(this.askToPlay){
            this.music_view.play();
        }
        $(this.view_config.control.controlItemSelector).removeAttr("disabled");
    }).bind('play', () => {
        this.startTimer();
        $(this.view_config.control.playorpauseSelector).children('span').attr("class", "icon-pause");
    }).bind('pause', () => {
        this.stopTimer();
        $(this.view_config.control.playorpauseSelector).children('span').attr("class", "icon-play");
    })
}
MusicPlayer.prototype.loadMusic = function(arg, askPlay){
    if(arguments.length < 1) return;
    if(askPlay == undefined) askPlay = true;
    let index, music;
    if(typeof arg == 'number') {
        index = arg;
        music = this.musiclist[index];
    }
    else if(typeof arg == 'object'){
        music = arg;
        index = this.findMusicIndexById(music.id);
    }
    else return;

    this.music_view.pause();

    if(this.music_view.src !== music.src){
        this.music_view.src = music.src;
        this.askToPlay = askPlay;
    }

    this.current_music_index = index;
    let $items = $(this.view_config.musiclist.itemSelector);
    $items.filter('.current').removeClass('current');
    $items[index].className += ' current';

    this.timerange.pointTo(0);
}
MusicPlayer.prototype.getMusicIndexById = function(id){
    return this.musiclist.findIndex((item) => { return item.id == id; });
}
MusicPlayer.prototype.clear = function(){
    music.src = "";
    $(this.view_config.control.controlItemSelector).attr("disabled",true);
}
MusicPlayer.prototype.previous = function(){
    let length = this.played_history.length;
    let index;
    if(this.played_history_pos < length){
        ++(this.played_history_pos);
        index = this.played_history[length - this.played_history_pos];
        this.loadMusic(index);
    }
}
MusicPlayer.prototype.next = function(force_next){
    if(this.played_history_pos > 0){
        let length = this.played_history.length
        --(this.played_history_pos);
        this.loadMusic(this.played_history[length - this.played_history_pos - 1]);
    }
    let next_index = -1;
    let mode = this.play_mode;
    if(force_next && mode == 1) mode = 0;   //if force_next is true, don't repeat self
    switch(mode){
        case 0:
            this.pushHistory(this.musiclist[this.current_music_index]);
            next_index = (this.current_music_index + 1) % this.musiclist.length;
            this.loadMusic(next_index)
            break;
        case 1:
            this.pushHistory(this.musiclist[this.current_music_index]);
            next_index = this.current_music_index;
            this.loadMusic(next_index);
            break;
        case 2:
            this.pushHistory(this.current_music_index);
            next_index = Math.floor(Math.random() * this.musiclist.length);
            this.loadMusic(next_index);
            break;
        default:
            break;
    }
}
MusicPlayer.prototype.pushHistory = function(music){
    if(this.played_history.length == this.max_history_size){
        this.played_history.shift();
    }
    this.played_history.push(music);
}
MusicPlayer.prototype.loadMusiclist = function(){
    this.musiclist = JSON.parse(localStorage.user_music);
    this.current_music_index = parseInt(localStorage.music_index);
    this.play_mode = parseInt(localStorage.play_mode);
    if(!this.music_list){
        //try to load data from server with Ajax
        //
        //if data is empty
        this.music_list = [];
        this.notrigger_music_index = -1;
        this.play_mode = 0;
    }
    if(this.current_music_index === undefined && this.music_list.length > 0) this.current_music_index = 0;
    if(this.play_mode === undefined) this.play_mode = 0;

    this.bindDataToMusiclist();
}
MusicPlayer.prototype.bindDataToMusiclist = function(){
    if(!this.listRenderFunc){
        this.buildMusiclist();
        return;
    }else{
        let renderRes = this.listRenderFunc({musiclist: this.musiclist, user: null});
        $(this.view_config.musiclist.ulSelector).html(renderRes);
        $(this.view_config.musiclist.headerTitleSelector).html("播放列表(" + this.musiclist.length + ")");
        if(this.musiclist.length > 0){
            this.loadMusic(0, false);
        }
    }
}
MusicPlayer.prototype.loadConfigs = function(){
    let volume_value = localStorage.volume ? localStorage.volume : 100;

    if(localStorage.volume_state == "blocked") {
        this.volume_before_blocked = volume_value;
        this.music_view.volume = 0;
    }

    this.volumerange.pointTo(volume_value);
}
MusicPlayer.prototype.buildMusiclist = function(){
    if(this.listRenderFunc) return;
    //this.view_config.musiclist.templateSelector must be an id selector!
    this.listRenderFunc = simpleERBTemplate(this.view_config.musiclist.templateSelector);
    $(this.view_config.musiclist.templateSelector).remove();

    this.bindDataToMusiclist();
    //adding favorite
    //...
    //adding marked
    //...
    //using on() replaces delegate()
    $(this.view_config.musiclist.ulSelector).on('click', this.view_config.musiclist.deleteButtonSelector, (e) => {
        let $item = $(e.target).parents(this.view_config.musiclist.itemSelector);
        let id = $item.attr("data-id");
        let targetIndex = this.getMusicIndexById(id);
        const FORCE_NEXT = true;
        $item.animate({left: '-100%'}, 200, () => {
            $item.remove();
            this.musiclist.splice(targetIndex, 1);
            if(this.current_music_index == targetIndex){
                if(this.musiclist.length == 0){ this.clear(); }
                else{
                    --(this.current_music_index); //for retriving next music correctly
                    this.next(FORCE_NEXT); //don't repeat self
                }
            }
            else if(this.current_music_index > targetIndex){ --(this.current_music_index); }
        });
    });
}
MusicPlayer.prototype.buildTimerange = function(){
    let timerange = new Rangebar(this.view_config.timerangeSelector);

    const CLEAR_OLD_HANDLER = true;
    let $timerange_tip_view = $(this.view_config.timerangeTipSelector);
    let $timerange_tip_text_view = $timerange_tip_view.children("p");

    let resetMusicTime = (e, seconds) => {
        this.music_view.currentTime = seconds;
        this.refreshCurrentTime();
    };
    let show_timerange_tip = (e, time, pos, pageX) => {
        if(time < 0) time = 0;
        $timerange_tip_text_view.html(seconds2m_s(time));
        let dirta = this.timerange.view.offset().left - $timerange_tip_view.parents().offset().left;
        $timerange_tip_view.css("left", (pos - $timerange_tip_view.width() / 2 + dirta) + "px");
        $timerange_tip_view.show();
    }
    let hide_timerange_tip = (e) => {
        $timerange_tip_view.hide();
    }

    timerange.bindEvent('pointchange', resetMusicTime, CLEAR_OLD_HANDLER);
    timerange.bindEvent('mouseoverrange', show_timerange_tip, CLEAR_OLD_HANDLER);
    timerange.bindEvent('mouseoutrange', hide_timerange_tip, CLEAR_OLD_HANDLER);

    this.timerange = timerange;
}
MusicPlayer.prototype.buildVolumerange = function(){
    let volumerange = new Rangebar(this.view_config.volume.rangeSelector);

    const CLEAR_OLD_HANDLER = true;
    let volume_control_icon = $(this.view_config.volume.controlSelector + ' > span');

    let refresh_volume_control_icon = (value) => {
        if(this.volume_before_blocked > -1) {
            volume_control_icon.attr("class", "icon-volume-blocked");
            return;
        }
        if(value == 0) volume_control_icon.attr("class", "icon-volume-mute");
        else if(value <= 33) volume_control_icon.attr("class", "icon-volume-low");
        else if(value <= 66) volume_control_icon.attr("class", "icon-volume-medium");
        else volume_control_icon.attr("class", "icon-volume-high");
    }
    let resetVolume = (e, value) => {
        if(this.volume_before_blocked == -1){
            this.music_view.volume = value / 100;
            volumerange.loadedTo(value);
            refresh_volume_control_icon(value);
        }
        else{
            this.volume_before_blocked = value;
        }
        localStorage.volume = value;
    }

    $(this.view_config.volume.controlSelector).bind('click', () => {
        if(this.volume_before_blocked == -1) {
            this.volume_before_blocked = music.volume * 100;
            this.music_view.volume = 0;
            refresh_volume_control_icon(this.volume_before_blocked);
            localStorage.volume_state = "blocked";
        }
        else{
            localStorage.volume_state = "";
            this.music_view.volume = this.volume_before_blocked / 100;
            let volume = this.volume_before_blocked;
            this.volume_before_blocked = -1;
            refresh_volume_control_icon(volume);
        }
    })
    volumerange.currentValue = 100;
    volumerange.bindEvent('pointchange', resetVolume, CLEAR_OLD_HANDLER);
    this.volumerange = volumerange;
}

MusicPlayer.prototype.bindControlEvents = function(){
    $(this.view_config.control.previousSelector).bind('click', () => { this.previous(); });
    $(this.view_config.control.playorpauseSelector).bind('click', () => {this.music_view.paused ? this.music_view.play() : this.music_view.pause();});
    $(this.view_config.control.nextSelector).bind('click', () => { this.next(); });
}
MusicPlayer.prototype.bindModeEvents = function(){
    $(this.view_config.modeSelector).bind('click', () => {
        this.play_mode = (this.play_mode + 1) % 3;
        $(this.view_config.modeSelector).children("span").attr('class', 'icon-'+this.modes[this.play_mode]);
        localStorage.play_mode = this.play_mode;
    });
}
MusicPlayer.prototype.bindMusicListToggleEvents = function(){
    let $music_list_view = $(this.view_config.musiclist.divSelector);
    let hide_music_list = () => {
        $music_list_view.animate({
            height: 0,
            width: 0
        }, 200, () => {
            $music_list_view.hide();
            $music_list_view.attr("aria-hidden", "true");
        });
    }
    let show_music_list = () => {
        $music_list_view.show();
        $music_list_view.animate({
            height: "400px",
            width: "800px"
        }, 200, () => {
            $music_list_view.removeAttr("aria-hidden");
        });
    }
    $(this.view_config.musiclist.closeSelector).bind('click', () => { hide_music_list(); })
    $(this.view_config.musiclistToggleSelector).bind('click',() => {
        if($music_list_view.attr("aria-hidden") == "true"){
            show_music_list();
        }
        else{
            hide_music_list();
        }
    });
}