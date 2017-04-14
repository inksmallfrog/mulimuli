/*
* @Author: inksmallfrog
* @Date:   2017-04-14 14:02:29
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-14 16:00:36
*/

'use strict';

var MusicList = function(id, onmusic_listready, onmusic_change){
    this.el = this.buildListView(id);
    this.music_list = [];
    this.current_music_index = -1;
    Object.defineProperty(this, "music_index", {
        get: function(){return this.current_music_index;},
        set: function(index){this.current_music_index = index; onmusic_change(this.music_list[index]);}
    });
    this.play_mode = 0;
    this.played_history = [];
    this.max_history_size = 40;
    this.played_history_pos = 0;
    this.loadData(onmusic_listready);
}

MusicList.prototype.buildListView = function(id){
    var jqEl = $(id);
    jqEl.append("<ul></ul>", {
        class: 'music_ul'
    }).append("<div></div>",{
        class: 'bottom_triangle'
    });
    return jqEl;
}

MusicList.prototype.loadData = function(onmusic_listready){
    this.music_list = JSON.parse(localStorage.user_music);
    this.current_music_index = parseInt(localStorage.current_index);
    this.play_mode = parseInt(localStorage.play_mode);
    if(this.play_mode === undefined) this.play_mode = 0;
    if(!this.music_list){
        //try to load data from server with Ajax
        //
        //if data is empty
        this.music_list = [];
        this.current_music_index = -1;
        this.play_mode = 0;
        onmusic_listready({src:""}, this.play_mode);
    }
    else{
        //render view
        onmusic_listready(this.music_list[this.current_music_index], this.play_mode);
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