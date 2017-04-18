/*
* @Author: inksmallfrog
* @Date:   2017-04-15 11:56:50
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-18 12:30:12
*/
'use strict';
var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res){
    let music_id = req.params.id;
    req.models.music.findById(music_id).then((results, err)=>{
        res.jsonp(results.dataValues);
    });
})

module.exports = router;