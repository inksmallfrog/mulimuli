/*
* @Author: inksmallfrog
* @Date:   2017-04-17 19:23:36
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-21 11:29:30
*/

'use strict';
function playlistModel(sequelize, DataType){
    let Playlist = sequelize.define('playlist',{
        title: {
            type: DataType.STRING,
            allowNull: false,
        },
        list_type: {
            type: DataType.ENUM('default', 'custom'),
            allowNull: false,
            defaultValue: 'custom',
        },
        playlist_favicon: {
            type: DataType.STRING,
            defaultValue: './uploads/playlist_icons/default.jpg',
        },
        owner_id:{
            type: DataType.INTEGER,
        },
    });
    return Playlist;
}
module.exports = playlistModel;