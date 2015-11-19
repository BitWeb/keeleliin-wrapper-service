var logger = require('log4js').getLogger('service_request');
var config = require('../../config');
var fs = require('fs');
var async = require('async');

function ServiceRequest( requestBody, requestFiles ) {
    var self = this;

    this.data = requestBody;
    this.files = requestFiles;
    var messages = null;

    this.isValid = function( cb ){
        self._mapParams();
        self._checkFiles(function (err) {
            cb(err, messages == null);
        });
    };

    this.setMessage = function (key, value) {

        if(messages == null){
            messages = {}
        }
        messages[key] = value;
    };

    this._mapParams = function(){

        for(var property in config.wrapper.requestConf.requestBodyParamsMappings){

            var value = self.data[property];

            var mapping = config.wrapper.requestConf.requestBodyParamsMappings[property];

            if(mapping.filter){
                value = mapping.filter(value);
            }

            if(mapping.required == true && value == undefined){
                self.setMessage(property, 'Väli on nõutud');
                continue;
            }

            if(mapping.allowEmpty == false && (value === null || value === '') ){
                self.setMessage(property, 'Väli on täitmata');
                continue;
            }

            if(value === null || value === undefined){
                value = mapping.value;
            }

            if(mapping.validator){
                mapping.validator(value, self);
            }
            self.data[property] = value;
        }
    };

    this._checkFiles = function ( cb ) {

        async.forEachOf(config.wrapper.requestConf.requestFiles, function (requestFile, fileId, innerCb) {

            logger.debug( requestFile );
            logger.debug( fileId );

            var fileItem = self.files[fileId];

            if(!fileItem){
                logger.error('Nõutud faili ei saadetud' + fileId, self.files);
                self.setMessage(fileId, 'Nõutud faili ei saadetud');
                return innerCb();
            }

            if(requestFile.isList == false && Array.isArray( fileItem )){
                self.setMessage(fileId, 'Lubatud on ainult 1 fail');
                return innerCb();
            }

            if(requestFile.sizeLimit > 0){

                var limitLeft = requestFile.sizeLimit;

                if( Array.isArray( fileItem ) ){
                    for(i in fileItem){
                        var fileItemItem = fileItem[i];
                        var stat = fs.statSync(fileItemItem.path);
                        limitLeft = limitLeft - stat.size;
                    }
                } else {
                    var stat = fs.statSync(fileItem.path);
                    limitLeft = limitLeft - stat.size;
                }

                if(limitLeft < 0){
                    self.setMessage(fileId, 'Saadetud failide mahu piirang ületati');
                }
            }

            return innerCb();
        }, cb);
    };

    this.getMessages = function(){
        return {errors: messages, success: false};
    };
}

module.exports = ServiceRequest;