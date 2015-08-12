var logger = require('log4js').getLogger('local_command');

function LocalCommand( commandModel ) {

    var self = this;

    var keyValues = commandModel.keyValues;

    logger.debug(keyValues);

    var commandTemplate = commandModel.serviceProperties.commandTemplate;

    this.templateParams = commandTemplate.match(/\[(.*?)]/g);
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

        for(index in this.templateParams){

            var propertyItem = this.templateParams[index];
            var propertyKey = propertyItem.substr(1, (propertyItem.length - 2));
            var value = keyValues[propertyKey];

            if(!value){
                throw new Error('Value not detected for property ' + propertyKey);
            }

            self._replacePropertyValue(propertyItem, value);
        }
    };

    this._replacePropertyValue = function (propertyItem, value) {

        for (i in commandParts) {
            var part = commandParts[i];
            commandParts[i] = part.replace(propertyItem, value);
        }
    };
}

module.exports = LocalCommand;