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
};

Session.prototype.addOutputFile = function(key, path){
    this.outputFiles[key] = path;
};

Session.prototype.setErrors = function(errors, path){
    this.errors = errors;
    this.isSuccess = false;
    this.message = Session.messages.ERROR
};

Session.prototype.getFile = function( key ){
    var fileValue = this.requestFiles[ key ];

    if(Array.isArray(fileValue)){
        return fileValue.pop();
    }
    return fileValue;
};

Session.prototype.getFiles = function( key ){
    var fileValue = this.requestFiles[ key ];

    if(Array.isArray(fileValue)){
        return fileValue;
    }
    return [fileValue];
};

Session.messages = {
    RUNNING: 'RUNNING',
    OK: 'OK',
    ERROR: 'ERROR',
    NOT_FOUND: "NOT_FOUND"
};

module.exports = Session;