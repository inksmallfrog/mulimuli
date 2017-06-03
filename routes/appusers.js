var express = require('express');
var router = express.Router();
let Sequelize = require('sequelize');
let sha1 = require('sha1');

/* GET users listing. */
function getUserPlayinglist(req, user_id){
    let jsonContent = {};
    console.log('getUserPlayinglist: ' + user_id);
    return req.models.appuser.findAll({
        where:{
            name: "缪丽缪丽",
        },
        include: [{
            model: req.models.playlist,
            where:{
                title: "playing",
                list_type: "default",
            },
            include: [{
                model: req.models.music,
                through: "music_in_list",
                attributes: ['id', 'title', 'artist', 'duration', 'src'],
            }]
        }]
    }).then((results, err)=>{
        jsonContent.current_playing_list = results[0].playlists[0].music;
        return jsonContent;
    });
}

function getUserInfo(models, logId){
    return models.appuser.findAll({
            where:{
                log_id: logId,
            },
            attributes: ['id', 'log_id', 'state', 'name', 'gender', 'favicon', 'info'],
            include: [{
                model: models.playlist,
                where:{
                    $or: {
                        title:{
                            $not: "playing",
                        },
                        list_type:{
                            $not: "default",
                        },
                    }
                },
                attributes: ['title', 'list_type', 'playlist_favicon'],
                include: [{
                    model: models.music,
                    through: 'music_in_list',
                    attributes: [Sequelize.fn('COUNT', Sequelize.col('id'))],
                }],
            }],
        });
}

function authorize(req, res, session, cookies, t_id){
    debugger
    if(session.appuser){    //the user has logged this app not so long before
        return getUserInfo(req.models, session.appuser).then((users)=>{
            return users[0];
        })
    }
    else{   //no session found
        if(cookies.log_id){     //it seems that the user has logged before
            return getUserInfo(req.models, cookies.log_id).then((users)=>{
                session.appuser = user.log_id;
                return users[0];
            })
        }
        else{   //user havn't logged before or it has been expired
            if(t_id){    //user have tried this app before in that machine
                return new Promise((resolve) => {resolve({ user: {log_id: t_id, state: "tempory"}, })});
            }
            else{   //WOW, I get a new user
                let t_id = sha1(req.ip + new Date());
                return req.models.appuser.create({
                    log_id: t_id,
                    state: "tempory",
                }).then((user) => {
                    return user;
                })
            }
        }
    }
}

router.get('/', function(req, res, next){
    let askfor = req.query.askfor;
    let session = req.session;
    let cookies = req.signedCookies;
    switch(askfor){
        case "auth":
            let t_id = req.query.t_id;
            authorize(req, res, session, cookies, t_id).then((jsonContent)=>{
                console.log(jsonContent);
                res.jsonp(jsonContent);
            });
            break;
        case "quit":
            req.session.destroy(()=>{
                console.log('quit');
                res.cookies = {};
                res.status(204).send({});
            })
            break;
    }
});

router.get('/:id', function(req, res, next) {
    let user_signed = req.params.id;
    if(req.session.appuser){
        getUserPlayinglist(req, req.session.appuser)
            .then((jsonContent) => {
                res.jsonp(jsonContent);
            });
    }
    else{
        //创建临时用户
        req.session.appuser = "mulimuli";
        //返回空列表
        getUserPlayinglist(req, req.session.appuser)
            .then((jsonContent) => {
                res.jsonp(jsonContent);
            });
    }
});

module.exports = router;
