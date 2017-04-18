/*
* @Author: inksmallfrog
* @Date:   2017-04-17 19:28:53
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-18 08:34:45
*/

'use strict';
function albumModel(sequelize, DataType){
    let Album = sequelize.define('album',{
        title: {
            type: DataType.STRING,
            allowNull: false,
        },
        releasedDate: {
            type: DataType.DATEONLY,
        }
    });
    return Album;
}
module.exports = albumModel;