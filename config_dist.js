
var config = require('./global_config/global');

//config.serverUrl = 'http://localhost';

//config.redis = {
//    host: process.env.REDIS_PORT_6379_TCP_ADDR || "127.0.0.1",
//    port: process.env.REDIS_PORT_6379_TCP_PORT || 6379
//};

//config.integration = [
//    {
//        installUrl: 'http://keeleliin.keeleressursid.ee:3000/api/v1/service/install',
//        apiKey: 'server-wrapper-api-key'
//    }
//];

//config.fs = {
//    storagePath: "/wrapper/files",
//    tmpPath: "/wrapper/tmp"
//};


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

config.wrapper = {
    id: 'concat', // unikaalne lühinimi
    title: 'Lihtne konjateneerija', //Avalik nimi
    description: 'Konkateneerib etteantud failid üheks suureks failiks', //Kirjeldus
    port: 3000, //port
    class: 'simpleLocalCommand',    //wrapperi failinimi wrapper kaustast, mida utiliidi käivitamiseks kasutatakse
    command: 'cat [data]',  // utiliidi käsurea käsk
    requestConf: { //Päringu seadistus
        requestBodyParamsMappings: {
            isAsync: {
                type: config.paramTypes.SELECT,
                options: ['0', '1'],
                value: '1',
                usageType: config.paramUsageTypes.META,
                filter: function (value) {
                    return value == 1;
                },
                required: true,
                allowEmpty: false,
                validator: function (value, request) {
                    if( typeof value != 'boolean' ){
                        request.setMessage('isAsync', 'Peab olema boolean');
                        return false;
                    }
                    return true;
                }
            }
        },
        requestFiles: {
            content: {
                type: 'text',
                sizeLimit: 0,
                sizeUnit: 'byte',
                isList: true
            }
        }
    },
    outputTypes: [ //teenuse väljundressursside kirjldused
        {
            type: 'text',
            key: 'output'
        }
    ],
    sessionMaxLifetime: 600 // sessiooni maksimaalne kestvus
};



module.exports = config;