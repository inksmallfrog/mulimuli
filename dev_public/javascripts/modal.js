/*
* @Author: inksmallfrog
* @Date:   2017-04-21 16:26:06
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-21 17:07:05
*/

'use strict';
let Modal = function(config){
    this.$content = $(config.divSelector);
    this.width = config.width ? config.width : '400px';
    this.height = config.height ? config_height : '200px';
    this.title = config.title ? config_title : "";

    this.$content;

    this.buildModal();
    //this.bindModalEvent();
    //this.showModal();
}

Modal.prototype.buildModal = function(){
    let $body = $('body');
    this.$content = $('<div class="frog_modal"></div>');
    let $modal_box = $('<div class="modal_content"></div>');
    let $modal_close_img = $('<span class="icon-close"></span>');
    let $modal_close_button = $('<button class="pointer modal_close"></button>');
    $modal_close_button.append($modal_close_img);
    $modal_box.append($modal_close_button);
    this.$content.append($modal_box);
    $body.append(this.$content);
}