/*
* @Author: inksmallfrog
* @Date:   2017-04-15 13:05:38
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-15 13:11:38
*/

"use strict";

var Sequelize = require('sequelize');
var sequelize = new Sequelize('mulimuli', 'host-user', 'password',{
    dialect: "postgres",
    port: 5432,
});