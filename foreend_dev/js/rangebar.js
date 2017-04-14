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