/*
* @Author: inksmallfrog
* @Date:   2017-04-17 18:50:10
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-20 07:56:52
*/
'use strict';
function appuserModel(sequelize, DataType){
    var Appuser = sequelize.define('appuser',{
        email: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
            validate:{
                is: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            },
        },
        pwd: {
            type: DataType.STRING,
            allowNull: false,
        },
        state: {
            type: DataType.ENUM("normal", "not verified", "deleted"),
            allowNull: false,
            defaultValue: "not verified",
        },
        name: {
            type: DataType.STRING,
        },
        male: {
            type: DataType.BOOLEAN,
        },
        favicon: {
            type: DataType.STRING,
            defaultValue: 'uploads/favicons/default.jpg',
        },
        info: {
            type: DataType.STRING,
        },
    });
    return Appuser;
}
module.exports = appuserModel;