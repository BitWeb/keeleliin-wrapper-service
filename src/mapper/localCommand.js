var logger = require('log4js').getLogger('local_command');
var config = require('../../config');

function LocalCommand( commandModel ) {

    var self = this;

    this.commandModel = commandModel;
    var commandTemplate = config.service.staticOptions.commandTemplate;
    this.templateParams = commandTemplate.match(/\[(.*?)]/g);
    this.commandParts = commandTemplate.split(' ');

    this.command = "";
    this.commandParams = [];

    this.generateLocalCommand = function () {

        self._parseParams();

        var paramsArray = this.commandParts.slice(this.commandParts);
        self.command = paramsArray.shift();
        self.commandParams = paramsArray.filter(function (value) { return value != ''; });
        return true;
    };

    this._parseParams = function () {

        for(index in this.templateParams){
            this._parseOnIndex( index );
        }
    };

    this._parseOnIndex = function (index) {

        var propertyItem = this.templateParams[index];
        var propertyKey = propertyItem.substr(1, (propertyItem.length - 2));
        var value = self.commandModel.keyValues[propertyKey];
        self._replacePropertyValue(propertyItem, value);
    };

    this._replacePropertyValue = function (propertyItem, value) {

        for (i in this.commandParts) {
            var part = this.commandParts[i];
            self.commandParts[i] = part.replace(propertyItem, value);
        }
    };

}

module.exports = LocalCommand;