/*
* @Author: inksmallfrog
* @Date:   2017-06-04 08:07:07
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-04 08:41:59
*/

'use strict';
var express = require('express');
var router = express.Router();

router.post('/', function(req, res){
    console.log(req.body);
    let music_id = req.body.musicId,
        text = req.body.text,
        showtime = req.body.showtime,
        ret = {};
    if(music_id > -1 && text){
        req.models.fly.create({
            music_id: music_id,
            content: text,
            showtime: showtime
        }).then((results, err)=>{
            ret = {
                hasError: false
            };
            res.jsonp(ret);
        });
    }
})

module.exports = router;