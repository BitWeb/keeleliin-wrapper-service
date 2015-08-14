
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


//config.serverUrl = 'http://dev.bitweb.ee';
//config.wrapper = config.availableWrappers.<WRAPPERKEY>; //eg config.wrapper = config.availableWrappers.TOKENIZER;
//config.wrapper.command.commandTemplate = 'python /home/priit/Programs/KEELELIIN/pyutil/tokenizer.py -i [data] -o [outputPath1]';
//config.fs.storagePath = "/home/priit/wrapper";
//config.fs.tmpPath = "/tmp/wrapper/";

module.exports = config;