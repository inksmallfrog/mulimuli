/*
* @Author: inksmallfrog
* @Date:   2017-04-17 19:29:59
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-18 13:36:42
*/

'use strict';
function flyModel(sequelize, DataType){
    let Fly = sequelize.define('fly',{
        content: {
            type: DataType.STRING,
            allowNull: false,
        },
        showtime: {
            type: DataType.INTEGER,
            allowNull: false,
        },
        music_id:{
            type: DataType.INTEGER,
        },
        user_id:{
            type: DataType.INTEGER,
        },
    });
    return Fly;
}
module.exports = flyModel;