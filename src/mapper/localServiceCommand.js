/**
 * Created by priit on 28.05.15.
 */

var config = require('../../config');
var session = require('../service/session');

function LocalServiceCommand( queryData ) {

    if(config.service.staticOptions.type != config.serviceTypes.LOCAL){
        throw new Error('Not valid service type');
    }

    this.queryData = queryData;
    var commandTemplate = config.service.staticOptions.commandTemplate;
    this.templateParams = commandTemplate.match(/\[(.*?)]/g);
    this.commandParts = commandTemplate.split(' ');


    this.command = "";
    this.comandParams = [];
    this.sessionId = this.queryData.service.meta.sessionId;
    this.isAsync = this.queryData.service.meta.isAsync;
}

LocalServiceCommand.prototype.generateLocalCommand = function( callback ){
    var self = this;
    this.parseParams(function (data) {
        var paramsArray = data.slice(data);
        self.command = paramsArray.shift();
        paramsArray = paramsArray.filter(function(n){ return n != '' && n != 'null' });
        self.comandParams = paramsArray;
        return callback(data);
    });
};

LocalServiceCommand.prototype.parseParams = function (callback ) {
    if(this.templateParams.length != 0 ){
        this.parseOnIndex(0,  callback );
    } else {
        callback( this.commandParts );
    }
};

LocalServiceCommand.prototype.parseOnIndex = function (index, callback ) {
    var self = this;

    var propertyItem = this.templateParams[index];

    if(!propertyItem){
        return callback( this.commandParts );
    }

    var propertyKey = propertyItem.substr(1, (propertyItem.length - 2)); //eemaldab [ ja ]

    console.log('Property item: ' + propertyItem);

    this.getPropertyValue( propertyKey, function ( value ){
        self.replacePropertyValue(propertyItem, value);
        index++;
        self.parseOnIndex(index,  callback );
    });
};

LocalServiceCommand.prototype.replacePropertyValue = function(propertyItem, value){
    for(i in this.commandParts){
        var part = this.commandParts[i];
        this.commandParts[i] = part.replace( propertyItem, value);
    }
};

LocalServiceCommand.prototype.getPropertyValue = function (property, callback) {

    console.log('Get property value: ' + property);

    var requestValue = this.queryData.service.params[property];
    var mappingObject = config.service.paramsMappings[property];
    var propertyValue = null;

    if(mappingObject == null || mappingObject == undefined){
        throw new Error('Mapping not found for property: ' + property);
    }

    if(mappingObject.mapping != null){
        propertyValue = mappingObject.mapping[requestValue];
    } else {
        propertyValue = requestValue;
    }

    if(mappingObject.usageType == config.paramUsageTypes.STRING){
        callback( propertyValue );
    } else if(mappingObject.usageType == config.paramUsageTypes.FILE){
        session.storeToFile(this.queryData.service.meta.sessionId, propertyValue, callback);
    }
};

module.exports = LocalServiceCommand;