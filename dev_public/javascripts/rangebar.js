/*
* @Author: inksmallfrog
* @Date:   2017-04-14 06:49:26
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-19 16:06:22
*/

'use strict';
/*
constructor:
    Rangebar(id [, direction = \'horizental\', posValue=0, loadedValue=0, max=100, min=0])

Interfaces:
    pointTo(value [, need_onpointchange = true])
    loadedTo(value)
    bindEvent(event, onpointchage[, need_clear_old = false])

Attributes:
    maxValue,
    minValue,
    currentValue,
    loadedValue

Event: pointchange(e, value)
       trigger: 1. call pointTo(value [, need_callback = true])
                2. call pointToPos(pos [[, value], need_callback = true])
       mouseoverrange(e, value, pos, pos_in_page)
       trigger: onmouseover
       mouseoutrange(e, value, pos, pos_in_page)
       trigger: onmouseout
 */
let Rangebar = function(){
    if(arguments.length < 1){
        console.log('Error arguments for construct Rangebar\n' +
            'usage: new Rangebar(id [, direction = \'horizental\', posValue=0, loadedValue=0, max=100, min=0])\n');
        return null;
    }
    let id = arguments[0],
        direction = arguments[1],
        posValue = arguments[2],
        loadedValue = arguments[3],
        max = arguments[4],
        min = arguments[5];

    this.direction = direction ? direction : 'horizental';
    this.view = this.buildRangebar($(id));

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
            this.pointTo(value); //set value without callback
        }
    })

    this.maxValue = max ? max : 100;
    this.minValue = min ? min : 0;

    this.ondragged = false;

    this.view.bind("mousemove", (e) => {
        this.view.trigger("mouseoverrange", [this.posToValue(this.relativePos(e)),
                                            this.relativePos(e),
                                            this.direction == "horizental" ? e.pageX : e.pageY]);
    });
    this.view.bind("mouseout", (e) => {
        this.view.trigger("mouseoutrange", [this.posToValue(this.relativePos(e)),
                                           this.relativePos(e),
                                           this.direction == "horizental" ? e.pageX : e.pageY]);
    });
    this.currentValue = posValue ? posValue : 0;
};

Rangebar.prototype.pointTo = function(value, need_callback){
    this.value = value;
    this.pointToPos(this.valueToPos(value), value, need_callback);
}

Rangebar.prototype.loadedTo = function(value){
    let $loaded_line = this.view.children('.loaded_line');
    let percentPos = value / this.max;
    $loaded_line.css('width', percentPos + '%');
}

Rangebar.prototype.bindEvent = function(event, callback, need_clear_old){
    if(need_clear_old){
        this.view.unbind(event);
    }
    this.view.bind(event, callback);
}

Rangebar.prototype.buildRangebar = function($range_view){
    $range_view.addClass('range').addClass(this.direction).addClass('pointer');
    $range_view.bind("click", (e) => {
        this.pointToPos(this.relativePos(e));
    }).bind("mousemove", (e) => {
        const NO_CALLBACK = false; // don't call callback until drag finished
        if(this.ondragged){
            this.pointToPos(this.relativePos(e), NO_CALLBACK);
        }
    }).bind("mouseout", (e) => {
        if(this.ondragged) {
            this.pointToPos(this.relativePos(e));
            this.ondragged = false;
        }
    });
    let track = $('<div></div>').addClass('track');
    track.append($('<div></div>').addClass('loaded_line')).append($('<div></div>').addClass('track_line'));
    let point = $('<div></div>').addClass('point');
    point.bind("mousedown", (e) => {
        this.ondragged = true;
    }).bind("mouseup", (e) => {
        this.pointToPos(this.relativePos(e));
        this.ondragged = false;
    }).bind("mouseout", function(e){
        if(this.ondragged) {
            this.pointToPos(this.relativePos(e));
            this.ondragged = false;
        }
    })
    $range_view.append(track).append(point);
    return $range_view;
}

Rangebar.prototype.pointToPos = function(p0, p1, p2){
    let pos, value, need_callback;
    if(arguments.length == 1){
        pos = p0;
    }
    else if(arguments.length == 2){
        pos = p0;
        need_callback = p1;
    }
    else if(arguments.length == 3){
        pos = p0;
        value = p1;
        need_callback = p2;
    }
    let point = this.view.children('.point');
    this.setPointPos(pos);
    if(value === undefined || value === null){
        this.value = this.posToValue(pos);
    }
    if(need_callback === undefined || need_callback){
        this.view.trigger("pointchange", this.value);
    }
}
Rangebar.prototype.setPointPos = function(pos){
    var point = this.view.children('.point');
    if(this.direction == "horizental") point.css('left', pos - point.width() / 2 + 'px');
    else point.css('top', pos - point.height() / 2 + 'px');
}
Rangebar.prototype.getWidgetLength = function(){
    if(this.direction == "horizental") return Math.floor(this.view.width());
    else return Math.floor(this.view.height());
}

Rangebar.prototype.valueToPos = function(value){
    return Math.floor(value / this.range * this.getWidgetLength());
}

Rangebar.prototype.posToValue = function(pos){
    return Math.floor(Math.floor(pos) / this.getWidgetLength() * this.range) + this.min;
}

Rangebar.prototype.relativePos = function(e){
    var res = 0;
    if(this.direction == "horizental") res = e.pageX - this.view.offset().left;
    else res = e.pageY - this.view.offset().top;
    return Math.max(Math.min(res, this.getWidgetLength()), 0);
}