var express = require('express');
var router = express.Router();

/* GET users listing. */
function getUserPlayinglist(req, user_id){
    let jsonContent = {};
    console.log('getUserPlayinglist: ' + user_id);
    return req.models.appuser.findAll({
        where:{
            name: "缪丽缪丽",
        }
    }).then((results, err)=>{
        jsonContent.current_music_index = 0;
        jsonContent.playmode = 0;
        let user = results[0];
        return user.getPlaylists({
            where:{
                title: "playing",
                list_type: "default",
            }
        });
    }).then((results, err)=>{
        let playlist = results[0];
        return playlist.getMusic({
            attributes: ['id', 'title', 'artist', 'duration', 'src'],
        });
    }).then((results, err)=>{
        jsonContent.current_playing_list = results;
        return jsonContent;
    });
}

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
