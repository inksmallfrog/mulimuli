/*
* @Author: inksmallfrog
* @Date:   2017-04-14 14:02:29
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-15 00:17:43
*/

'use strict';

var MusicList = function(selector, onmusic_listready, onmusic_change){
    this.el = $(selector);
    this.music_list = [];
    this.current_music_index = -1;
    Object.defineProperty(this, "music_index", {
        get: function(){return this.current_music_index;},
        set: function(index){
            this.current_music_index = index;
            localStorage.current_index = index;
            onmusic_change(this.music_list[index], index);
        }
    });
    this.play_mode = 0;
    this.played_history = [];
    this.max_history_size = 40;
    this.played_history_pos = 0;
    this.loadData(onmusic_listready);
}

MusicList.prototype.buildListView = function(){
    var music_ul = this.el.children(".music_ul");
    var renderRes = simpleERBTemplate('music_template', {music_list: this.music_list, current: this.current_music_index});
    $('#music_template').parent()[0].innerHTML += renderRes;
    $('#music_template').remove();
}

MusicList.prototype.loadData = function(onmusic_listready){
    this.music_list = JSON.parse(localStorage.user_music);
    this.current_music_index = parseInt(localStorage.current_index);
    this.play_mode = parseInt(localStorage.play_mode);
    if(this.play_mode === undefined) this.play_mode = 0;
    if(this.current_music_index === undefined && this.music_list.length > 0) this.music_index = 0;
    if(!this.music_list){
        //try to load data from server with Ajax
        //
        //if data is empty
        this.music_list = [];
        this.current_music_index = -1;
        this.play_mode = 0;
        this.buildListView();
        onmusic_listready({src:""}, -1, this.play_mode);
        $('.music_list > .header > .title').html("播放列表(" + this.music_list.length + ")");
    }
    else{
        this.buildListView();
        onmusic_listready(this.music_list[this.current_music_index], this.current_music_index, this.play_mode);
        $('.music_list > .header > .title').html("播放列表(" + this.music_list.length + ")");
    }
}

MusicList.prototype.autoNext = function(){
    if(this.played_history_pos != 0){
        var length = this.played_history.length
        --(this.played_history_pos);
        this.music_index = this.played_history[length - this.played_history_pos];
    }
    switch(this.play_mode){
        case 0:
            this.pushHistory(this.current_music_index);
            this.music_index = (this.current_music_index + 1) % this.music_list.length;
            break;
        case 1:
            this.music_index = this.current_music_index;
            break;
        case 2:
            this.pushHistory(this.current_music_index);
            this.music_index = Math.floor(Math.random() * this.music_list.length);
            break;
        default:
            break;
    }
}

MusicList.prototype.next = function(){
    if(this.played_history_pos != 0){
        var length = this.played_history.length
        --(this.played_history_pos);
        this.music_index = this.played_history[length - this.played_history_pos - 1];
    }
    switch(this.play_mode){
        case 0:
            this.pushHistory(this.current_music_index);
            this.music_index = (this.current_music_index + 1) % this.music_list.length;
            break;
        case 1:
            this.pushHistory(this.current_music_index);
            this.music_index = (this.current_music_index + 1) % this.music_list.length;
            break;
        case 2:
            this.pushHistory(this.current_music_index);
            this.music_index = Math.floor(Math.random() * this.music_list.length);
            break;
        default:
            break;
    }
}

MusicList.prototype.pushHistory = function(index){
    if(this.played_history.length == this.max_history_size){
        this.played_history.shift();
    }
    this.played_history.push(index);
}

MusicList.prototype.previous = function(){
    var length = this.played_history.length;
    if(this.played_history_pos < length){
        ++(this.played_history_pos);
        this.music_index = this.played_history[length - this.played_history_pos];
    }
}