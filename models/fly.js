/*
* @Author: inksmallfrog
* @Date:   2017-04-17 19:29:59
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-20 08:32:54
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
        owner_id:{
            type: DataType.INTEGER,
        },
    });
    return Fly;
}
module.exports = flyModel;