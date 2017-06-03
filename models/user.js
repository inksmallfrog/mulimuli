/*
* @Author: inksmallfrog
* @Date:   2017-04-17 18:50:10
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-21 16:00:45
*/
'use strict';
function appuserModel(sequelize, DataType){
    var Appuser = sequelize.define('appuser',{
        log_id: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
        },
        pwd: {
            type: DataType.STRING,
        },
        state: {
            type: DataType.ENUM("normal", "not verified", "deleted", "tempory"),
            allowNull: false,
            defaultValue: "not verified",
        },
        name: {
            type: DataType.STRING,
        },
        gender: {
            type: DataType.ENUM("male", "female"),
            defaultValue: "female",
        },
        favicon: {
            type: DataType.STRING,
            defaultValue: './uploads/user_icons/default.jpg',
        },
        info: {
            type: DataType.STRING,
        },
    });
    return Appuser;
}
module.exports = appuserModel;