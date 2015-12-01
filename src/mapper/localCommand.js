var logger = require('log4js').getLogger('local_command');

function LocalCommand( commandModel ) {

    var self = this;

    var keyValues = commandModel.keyValues;
    var commandTemplate = commandModel.serviceProperties.commandTemplate;

    var templateParams = commandTemplate.match(/\[(.*?)]/g);
    var commandParts = commandTemplate.split(' ');

    this.command = "";
    this.commandParams = [];




    this.generate = function () {
        self._parseParams();
        var paramsArray = commandParts.slice(commandParts);
        self.command = paramsArray.shift();
        self.commandParams = paramsArray.filter(function (value) { return value != '' && value != null && value != undefined; });
        return self;
    };

    this._parseParams = function () {

        for(index in templateParams){

            var property = templateParams[index];
            var propertyKey = property.substr(1, (property.length - 2));
            var value = keyValues[propertyKey];

            if(!value){
                throw new Error('Value not detected for property ' + propertyKey);
            }

            self._setCommandPropertyValue(property, value);
        }
    };

    this._setCommandPropertyValue = function (propertyItem, value) {

        var newCommandParts = [];

        for (i in commandParts) {
            if( commandParts[i] == propertyItem){
                if(Array.isArray(value)){
                    for(j in value){
                        newCommandParts.push(value[j]);
                    }
                } else {
                    newCommandParts.push(value);
                }
            } else {
                newCommandParts.push(commandParts[i]);
            }
        }

        commandParts = newCommandParts;
    };
}

module.exports = LocalCommand;