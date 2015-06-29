var logger = require('log4js').getLogger('router_middleware');
var sessionService = require('../service/sessionService');

function CommandModel(){

    var self = this;
    this.session = null;
    this.serviceProperties = {};//näiteks local command template
    this.outputPaths = {}; //väljundfailid
    this.keyValues = {}; //teenuse parameetrid

    var fileValues = [];

    this.init = function ( session ) {
        self.session = session;
    };

    this.setTextValue = function (key, value) {
        self.keyValues[key] = value;
    };

    /*
    * Antud väärtus kirjutatakse faili
    * */
    this.setFileValue = function (key, value) {
        fileValues.push(
            {key: key, value: value}
        );
    };

    /*
    * Kasutatava programmi väljund
    * */
    this.addOutputPath = function (key) {
        self.outputPaths[key] = sessionService.getNewSessionFilePath( self.session );
    };

    this.render = function ( callback ) {
        for(i in self.outputPaths){
            self.keyValues[i] = self.outputPaths[i];
        }
        //store file values
        if(fileValues.length > 0){
            self._storeToFile(0, callback);
        } else {
            callback();
        }
    };

    this._storeToFile = function (index, callback) {
        var fileValue = fileValues[index];
        sessionService.storeToFile(self.session.id, fileValue['value'], function (err, path) {
            if(err) return callback(err);

            self.keyValues[fileValue['key']] = path;
            index = index + 1;

            if(fileValues.length < index){
                self._storeToFile(index, callback);
            } else {
                callback();
            }
        });
    }
}

module.exports = CommandModel;
