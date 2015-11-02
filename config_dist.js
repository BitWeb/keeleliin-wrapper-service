
var config = require('./wrapper_configs/global');

/*config.log4js.appenders.push({
    "type": "logLevelFilter",
    "level": "ERROR",
    "appender": {
        "type": "smtp",
        "layout": {
             type: 'pattern',
             pattern: "[%d] [%x{port}-%x{pid}][%5.5p] %c - %m",
             tokens: {
                     pid: process.pid,
                     port: config.port
                 }
         },
        "recipients": "***********",
        "sendInterval": 10, //sec
        "transport": "SMTP",
        "SMTP": {
            "host": "smtp.gmail.com",
            "secureConnection": false,
            "port": 587,
            "auth": {
                "user": "***********",
                "pass": "***********"
            },
            "debug": true
        }
    }
});*/

config.serverUrl = process.env.SERVER_URL || 'http://dev.bitweb.ee';
config.wrapper = process.env.WRAPPER ? (config.availableWrappers + process.env.WRAPPER) : config.availableWrappers.CONCAT;

config.fs.storagePath = "/files";
config.fs.tmpPath = "/tmp";

module.exports = config;