/**
 * Created by priit on 12.06.15.
 */

var LocalExecutor = require('./executor/localExecutor');
var config = require('../../config');


function ExecutorService(){

    this.execute = function( commandModel, callbac){

        if(config.service.staticOptions.type == config.serviceTypes.LOCAL){
            var executor = new LocalExecutor();
            return executor.execute(commandModel, callbac);
        } else {
            new Error('Teenuse tüüp ei ole sobiv');
        }
    };
}

module.exports = new ExecutorService();