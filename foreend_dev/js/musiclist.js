/*
* @Author: inksmallfrog
* @Date:   2017-04-14 14:02:29
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-15 10:37:06
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

MusicList.prototype.buildListView = function(onmusiclist_datachange){
    var renderRes = simpleERBTemplate('music_template', {music_list: this.music_list, user: null});
    var $music_template = $('#music_template');
    $music_template.parent()[0].innerHTML += renderRes;
    $music_template.remove();
    var self = this;

    //删除音乐
    $('.music_ul').on('click', '.music_item > .delete', function(e){
        var $ele = $(e.target).parents('.music_item');
        var id = $ele.attr("data-id");
        var targetIndex = self.getIndexById(id);
        $ele.animate({width: 0}, 200, function(){
            $(this).remove();
            self.music_list.splice(targetIndex, 1);
            if(self.music_index == targetIndex){
                if(self.music_list.length == 0){ onmusiclist_datachange(null); }
                else{
                    --(self.notrigger_music_index); //for retriving next music correctly
                    self.next();
                }
            }
            else if(self.music_index > targetIndex){ --(self.notrigger_music_index); }
        });
    });
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

MusicList.prototype.autoNext = function(){
    if(this.played_history_pos != 0){
        var length = this.played_history.length
        --(this.played_history_pos);
        this.music_index = length - this.played_history_pos;
    }
    switch(this.play_mode){
        case 0:
            this.pushHistory(this.notrigger_music_index);
            this.music_index = (this.notrigger_music_index + 1) % this.music_list.length;
            break;
        case 1:
            this.music_index = this.music_index;
            break;
        case 2:
            this.pushHistory(this.notrigger_music_index);
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
            this.pushHistory(this.notrigger_music_index);
            this.music_index = (this.notrigger_music_index + 1) % this.music_list.length;
            break;
        case 1:
            this.pushHistory(this.notrigger_music_index);
            this.music_index = (this.notrigger_music_index + 1) % this.music_list.length;
            break;
        case 2:
            this.pushHistory(this.notrigger_music_index);
            this.music_index = Math.floor(Math.random() * this.music_list.length);
            break;
        default:
            break;
    }
    console.log(this.music_index);
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

MusicList.prototype.getIndexById = function(id){
    return this.music_list.findIndex(function(item){ return item.id == id; });
}