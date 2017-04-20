/*
* @Author: inksmallfrog
* @Date:   2017-04-18 08:39:57
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-20 08:24:34
*/

'use strict';
const Hapi = require('hapi');
const server = new Hapi.Server();
const Sequelize = require('sequelize');

let Appuser;
let Music;
let Album;
let Playlist;
let Fly;
let PlaylistMusic;

let database;

function initDatabase(config){
    return server.register(
        [
            {
                register: require('hapi-sequelize'),
                options:{
                    name: config.db.serverName,
                    models: ['./models/*.js'],
                    sync: config.db.sync,
                    forceSync: config.db.forceSync,
                    sequelize: new Sequelize(config.db.name, config.db.user, config.db.pwd, config.db.sequelizeOpt),
                }
            }
        ]
    ).then(()=>{
        return server.plugins['hapi-sequelize']['postgresDB'];
    })
}

function createAssociations(){
    Appuser.hasMany(Music, {
        foreignKey: 'owner_id',
        constraints: false,
    })
    Appuser.hasMany(Playlist, {
        foreignKey: 'owner_id',
    })
    Appuser.hasMany(Fly, {
        foreignKey: 'owner_id',
    })
    Music.hasMany(Fly, {
        foreignKey: 'music_id',
    })
    Music.belongsTo(Appuser, {
        foreignKey: 'owner_id',
        constraints: false,
    })
    Music.belongsTo(Album, {
        foreignKey: 'album_id',
        constraints: false,
    })
    Music.belongsToMany(Playlist, {
        through: "music_in_playlist",
        foreignKey: "music_id"
    })
    Album.hasMany(Music,{
        foreignKey: 'album_id',
        constraints: false,
    })
    Playlist.belongsTo(Appuser, {
        foreignKey: 'owner_id',
    });
    Playlist.belongsToMany(Music, {
        through: "music_in_playlist",
        foreignKey: "playlist_id"
    });
    Fly.belongsTo(Appuser, {
        foreignKey: 'owner_id',
    })
    Fly.belongsTo(Music, {
        foreignKey: 'music_id',
    });
}

function createHooks(){
    Appuser.hook('afterCreate', function(user, options){
        //send verify email
        Playlist.create({
            title: "playing",
            list_type: "default",
            owner_id: user.get('id'),
        });
        Playlist.create({
            title: "favorite",
            list_type: "default",
            owner_id: user.get('id'),
        });
    });
}

function insertInitData(){
    let rootuser = Appuser.create({
        email: 'mulimuli@mulimuli.com',
        pwd: 'mulimuli_root',
        state: 'normal',
        name: '缪丽缪丽',
        male: false,
    });
    let m0 = Music.create({
        title: "さくらの季节",
        artist: "38BEETS",
        duration: "200",
        src: "./uploads/music/38BEETS - さくらの季节.mp3",
        cover_src: "./uploads/music_covers/38BEETS - さくらの季节.jpg",
    });
    let m1 = Music.create({
        title: "ほたる火",
        artist: "a_hisa",
        duration: "200",
        src: "./uploads/music/a_hisa - ほたる火.mp3",
        cover_src: "./uploads/music_covers/a_hisa - ほたる火.jpg",
    });
    let m2 = Music.create({
        title: "鳥の詩 (short version)",
        artist: "Key Sounds Label",
        duration: "200",
        src: "./uploads/music/Key Sounds Label - 鳥の詩 (short version).mp3",
        cover_src: "./uploads/music_covers/Key Sounds Label - 鳥の詩 (short version).jpg",
    });

    Promise.all([rootuser, m0, m1, m2]).then((values) => {
        rootuser = values[0];
        m0 = values[1];
        m1 = values[2];
        m2 = values[3];
        let flies = [];
        flies.push(Fly.create({
            content: "弹幕1",
            showtime: "1",
            user_id: values[0].id,
            music_id: values[1].id,
        }));
        flies.push(Fly.create({
            content: "弹幕2",
            showtime: "1",
            user_id: values[0].id,
            music_id: values[1].id,
        }));
        flies.push(Fly.create({
            content: "弹幕31333",
            showtime: "4",
            user_id: values[0].id,
            music_id: values[1].id,
        }));
        flies.push(Fly.create({
            content: "弹幕4",
            showtime: "2",
            user_id: values[0].id,
            music_id: values[1].id,
        }));
        flies.push(Fly.create({
            content: "弹幕5",
            showtime: "18",
            user_id: values[0].id,
            music_id: values[1].id,
        }));
        return Promise.all(flies);
    }).then((values) => {
        rootuser.getPlaylists({
            where: {
                title: "playing",
                list_type: "default",
            }
        }).then((playings)=>{
            playings[0].addMusic(m0);
            playings[0].addMusic(m1);
            playings[0].addMusic(m2);
        });
    })
}

exports.init = (config) => {
    initDatabase(config).then((db)=>{
        database = db;
        db.sequelize.sync().then(function () {
            console.log('models synced');
            Appuser = db.getModel('appuser');
            Music = db.getModel('music');
            Album = db.getModel('album');
            Playlist = db.getModel('playlist');
            Fly = db.getModel('fly');
            createAssociations();
            createHooks();
            insertInitData();
        });
    }).catch((err)=>{
        console.log(err);
    })
    return (req, res, next) => {
        req.models = database.sequelize.models;
        next();
    }
}
