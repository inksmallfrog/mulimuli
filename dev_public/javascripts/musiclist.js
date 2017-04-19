/*
* @Author: inksmallfrog
* @Date:   2017-04-14 14:02:29
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-19 13:48:22
*/

'use strict';

var MusicList = function(selector, onmusiclist_datachange, onmusic_change){
    this.$el = $(selector);
    this.music_list = [];
    this.notrigger_music_index = -1;
    Object.defineProperty(this, "music_index", {
        get: function(){return this.notrigger_music_index;},
        set: function(index){
            this.notrigger_music_index = index;
            localStorage.music_index = index;
            onmusic_change(this.music_list[index], index);
        }
    });
    this.play_mode = 0;
    this.played_history = [];
    this.max_history_size = 40;
    this.played_history_pos = 0;
    this.loadData(onmusiclist_datachange);
}

MusicList.prototype.loadData = function(onmusiclist_datachange){
    this.music_list = JSON.parse(localStorage.user_music);
    this.notrigger_music_index = parseInt(localStorage.music_index);
    this.play_mode = parseInt(localStorage.play_mode);
    if(!this.music_list){
        //try to load data from server with Ajax
        //
        //if data is empty
        this.music_list = [];
        this.notrigger_music_index = -1;
        this.play_mode = 0;
    }
    if(this.notrigger_music_index === undefined && this.music_list.length > 0) this.notrigger_music_index = 0;
    if(this.play_mode === undefined) this.play_mode = 0;
    this.buildListView(onmusiclist_datachange);
    onmusiclist_datachange(this.music_list[this.notrigger_music_index], this.notrigger_music_index, this.play_mode);
    $('.music_list > .header > .title').html("播放列表(" + this.music_list.length + ")");
}


