/*
* @Author: inksmallfrog
* @Date:   2017-04-15 11:56:50
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-15 11:59:11
*/
'use strict';
var express = require('express');
var router = express.Router();

router.get('/music/:id', function(req, res){
    var music_id = req.params.id;
})