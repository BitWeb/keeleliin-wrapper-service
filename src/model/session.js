var logger = require('log4js').getLogger('session_model');

var Session = function( id ){
    this.isAsync = false;
    this.isFinished = false;
    this.id = id;
    this.success = false;
    this.message = Session.messages.NOT_FOUND;
    this.recheckInterval = 1;
    this.requestBody = {};
    this.requestFiles = {};
    this.data = null;
    this.outputFiles = {};
    this.errors = null;
    this.pid = null; //system process id
    this.log = [];
};

Session.prototype.addOutputFile = function(key, file){
    this.outputFiles[key] = file;
};

Session.prototype.setErrors = function(errors){
    this.errors = errors;
    this.isSuccess = false;
    this.message = Session.messages.ERROR
};

Session.prototype.addLog = function(log){

    if( ! this.log instanceof Array){
        logger.error('Session is not array: ', this.log);
    }
    this.log.push( log );
};

Session.prototype.getRequestFile = function( key ){
    var fileValue = this.requestFiles[ key ];

    if(Array.isArray(fileValue)){
        return fileValue.pop();
    }
    return fileValue;
};

Session.prototype.getRequestFiles = function( key ){
    var fileValues = this.requestFiles[ key ];

    if(Array.isArray(fileValues)){
        return fileValues;
    }
    return [fileValues];
};

Session.messages = {
    RUNNING: 'RUNNING',
    OK: 'OK',
    ERROR: 'ERROR',
    NOT_FOUND: "NOT_FOUND"
};

module.exports = Session;