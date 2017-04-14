/*
* @Author: inksmallfrog
* @Date:   2017-04-06 07:53:59
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-14 15:59:44
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
        time_range_tip.css("left", (pageX - time_range_tip.width() / 2) + "px");
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
        var mode_num = ++(music_list.play_mode);
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


    var list_shown = false;
    $('.music_list_control').on('click',function(){
        if(list_shown) return;
        else{
            //set position of music_list?
            //show music_list
        }
    });
});
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
/*
* @Author: inksmallfrog
* @Date:   2017-04-14 06:49:26
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-14 13:53:40
*/

'use strict';
var Rangebar = function(){
    var id, max, direction, defaultValue, pointchange, mouseover, mouseout;
    if(arguments.length < 2){
        console.log('Error arguments for calling Rangebar()\n' +
            'eg. new Rangebar(id, maxValue)\n' +
            '    new Rangebar(id, maxValue, onpointchange)\n' +
            '    new Rangebar(id, maxValue, defaultValue, onpointchange)\n' +
            '    new Rangebar(id, maxValue, defaultValue, onpointchange, onmouseover, onmouseout)\n' +
            '    new Rangebar(id, maxValue, defaultValue, direction, onpointchange, onmouseover, onmouseout)\n');
        return null;
    }
    if(arguments.length >= 2){ id = arguments[0]; max = arguments[1]; }
    if(arguments.length == 3){ pointchange = arguments[2]; }
    if(arguments.length >= 4){ defaultValue = arguments[2]; pointchange = arguments[3]; }
    if(arguments.length >= 6){ mouseover = arguments[4]; mouseout = arguments[5]; }
    if(arguments.length >= 7){ direction = arguments[3]; onpointchange = arguments[4];
        mouseover = arguments[5]; mouseout = arguments[6];}
    if(!defaultValue) defaultValue = 0;
    if(!direction) direction = "horizental";
    if(!pointchange) pointchange = function(){};
    if(!mouseover) mouseover = function(){};
    if(!mouseout) mouseout = function(){};

    this.direction = direction;
    this.el = this.buildRangebar($(id));
    Object.defineProperty(this, 'maxValue', {
        get: function(){ return this.max; },
        set: function(max){
            this.max = max;
            if(this.max >= 0 && this.min >= 0) this.range = this.max - this.min;
            else this.range = NaN;
        }
    });
    Object.defineProperty(this, 'minValue', {
        get: function(){ return this.min; },
        set: function(min){
            this.min = min;
            if(this.max >= 0 && this.min >= 0) this.range = this.max - this.min;
            else this.range = NaN;
        }
    });
    Object.defineProperty(this, 'currentValue', {
        get: function(){return this.value},
        set: function(value){
            this.pointto(value, false); //set value without callback
        }
    })
    this.maxValue = max;
    this.minValue = 0;
    this.ondragged = false;
    this.el.bind("pointchange", pointchange);
    this.el.bind("range_mouseover", mouseover);
    this.el.bind("range_mouseout", mouseout);
    var self = this;
    this.el.bind("mousemove", function(e){
        self.el.trigger("range_mouseover", [self.postovalue(self.relativePos(e)),
                                            self.relativePos(e),
                                            self.direction == "horizental" ? e.pageX : e.pageY]);
    });
    this.el.bind("mouseout", function(e){
        self.el.trigger("range_mouseout", [self.postovalue(self.relativePos(e)),
                                           self.relativePos(e),
                                           self.direction == "horizental" ? e.pageX : e.pageY]);
    });
    this.currentValue =  defaultValue;
};

Rangebar.prototype.buildRangebar = function(range){
    range.addClass('range').addClass(this.direction).addClass('pointer');
    var self = this;
    range.bind("click", function(e){
             self.pointtoPos(self.relativePos(e));
         })
         .bind("mousemove", function(e){
             if(self.ondragged){
                 self.pointtoPos(self.relativePos(e), false); // don't call callback until drag finished
             }
         })
         .bind("mouseout", function(e){
            if(self.ondragged) {
                self.pointtoPos(self.relativePos(e));
                self.ondragged = false;
            }
         });
    var track = $('<div></div>').addClass('track');
    track.append($('<div></div>').addClass('loaded_line')).append($('<div></div>').addClass('track_line'));
    var point = $('<div></div>').addClass('point');
    point.bind("mousedown", function(e){
            self.ondragged = true;
         })
         .bind("mouseup", function(e){
            self.pointtoPos(self.relativePos(e));
            self.ondragged = false;
         })
         .bind("mouseout", function(e){
            if(self.ondragged) {
                self.pointtoPos(self.relativePos(e));
                self.ondragged = false;
            }
         })

    range.append(track).append(point);
    return range;
}

Rangebar.prototype.pointtoPos = function(p0, p1, p2){
    var pos, value, callback;
    if(arguments.length == 1){
        pos = p0;
    }
    else if(arguments.length == 2){
        pos = p0;
        callback = p1;
    }
    else if(arguments.length == 3){
        pos = p0;
        value = p1;
        callback = p2;
    }
    var point = this.el.children('.point');
    this.setPointPos(pos);
    if(value === undefined || value === null){
        this.value = this.postovalue(pos);
    }
    if(callback === undefined || callback){
        this.el.trigger("pointchange", this.value);
    }
}
Rangebar.prototype.setPointPos = function(pos){
    var point = this.el.children('.point');
    if(this.direction == "horizental") point.css('left', pos - point.width() / 2 + 'px');
    else point.css('top', pos - point.height() / 2 + 'px');
}
Rangebar.prototype.getWidgetLength = function(){
    if(this.direction == "horizental") return this.el.width();
    else return this.el.height();
}
Rangebar.prototype.pointto = function(value, callback){
    this.value = value;
    this.pointtoPos(this.valuetopos(value), value, callback);
}

Rangebar.prototype.valuetopos = function(value){
    return Math.floor(value / this.range * this.getWidgetLength());
}

Rangebar.prototype.postovalue = function(pos){
    return Math.floor(pos / this.getWidgetLength() * this.range) + this.min;
}

Rangebar.prototype.relativePos = function(e){
    var res = 0;
    if(this.direction == "horizental") res = e.pageX - this.el.offset().left;
    else res = e.pageY - this.el.offset().top;

    return Math.max(Math.min(res, this.getWidgetLength()), 0);
}