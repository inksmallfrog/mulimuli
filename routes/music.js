/*
* @Author: inksmallfrog
* @Date:   2017-04-15 11:56:50
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-20 14:39:15
*/
'use strict';
var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res){
    let music_id = req.params.id;
    let ret = {};
    req.models.music.findById(music_id, {
        attributes: ['id', 'cover_src'],
    }).then((results, err)=>{
        ret.cover_src = results.cover_src;
        console.log(ret);
        return results.getFlies({
            order:'showtime',
        });
    }).then((results, err) => {
        ret.flies = results;
        res.jsonp(ret);
    })
})

module.exports = router;