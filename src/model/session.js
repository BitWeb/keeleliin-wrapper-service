/**
 * Created by priit on 1.06.15.
 */
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
};

Session.prototype.addOutputFile = function(key, file){
    this.outputFiles[key] = file;
};

Session.prototype.setErrors = function(errors){
    this.errors = errors;
    this.isSuccess = false;
    this.message = Session.messages.ERROR
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