/*
* @Author: inksmallfrog
* @Date:   2017-04-17 19:19:57
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-18 13:36:44
*/

'use strict';
function musicModel(sequelize, DataType){
    let Music = sequelize.define('music',{
        title: {
            type: DataType.STRING,
            allowNull: false,
        },
        artist: {
            type: DataType.STRING,
            allowNull: false,
        },
        duration: {
            type: DataType.INTEGER,
            allowNull: false,
        },
        src: {
            type: DataType.STRING,
            allowNull: false,
        },
        cover_src: {
            type: DataType.STRING,
            defaultValue: "uploads/music_cover/default.jpg",
        },
        lyrics_src: {
            type: DataType.STRING,
        },
        owner_id:{
            type: DataType.INTEGER,
        },
        album_id:{
            type: DataType.INTEGER,
        },
    });
    return Music;
}
module.exports = musicModel;