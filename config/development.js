/*
* @Author: inksmallfrog
* @Date:   2017-04-17 18:46:38
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-18 17:03:59
*/

'use strict';
module.exports = {
    port: 3000,
    db:{
        serverName: "postgresDB",
        sync: true,
        forceSync: true,
        name: "mulimuli",
        user: "user",
        pwd: "password",
        sequelizeOpt: {
            dialect: "postgres",
            port: 5432,
            timezone: "+08:00",
            define:{
                underscoredAll: true,
            },
        }
    }
}