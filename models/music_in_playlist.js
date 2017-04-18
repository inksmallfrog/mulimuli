/*
* @Author: inksmallfrog
* @Date:   2017-04-18 13:39:06
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-18 13:40:21
*/

'use strict';
function music_in_playlistModel(sequelize, DataType){
    let MusicInPlaylist = sequelize.define('music_in_playlist',{
        music_id:{
            type: DataType.INTEGER,
        },
        playlist_id:{
            type: DataType.INTEGER,
        },
    });
    return MusicInPlaylist;
}
module.exports = music_in_playlistModel;