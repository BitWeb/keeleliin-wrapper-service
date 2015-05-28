/**
 * Created by priit on 26.05.15.
 */

var randomstring = require('randomstring');

Sessions = {

    map: {},

    get: function(id){
        return this.map.id;
    },

    set: function(session){

        var id = session.sessionId;
        if(id == undefined){
            id = this.generateId();
            session.sessionId = id;
        }
        /*console.log("-------------------------------------");
        console.log(this.map);
        console.log("-------------------------------------");*/

        this.map[id] = session;
        return session;
    },

    remove: function (session){
        delete map[session.sessionId];
    },

    generateId: function(){
        return randomstring.generate(28);
    }
};

exports.Sessions = Sessions;
