
var config = {};

config.port = 8000;

config.redis = {
    host: "127.0.0.1",
    port: 6379
};

config.log4js = {
    appenders: [
        { type: 'console',
            layout: {
                type: 'pattern',
                pattern: "[%d] %[[%x{pid}] [%5.5p]%] %c - %m",
                tokens: {
                    pid: process.pid
                }
            }
        },
        { type: 'file',
            filename: __dirname + 'keeleliin-server.log'
        },
        {
            "type": "logLevelFilter",
            "level": "ERROR",
            "appender": {
                "type": "smtp",
                "recipients": "**********",
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
        }
    ]
};

config.serviceTypes = {
    LOCAL: 'LOCAL'
};

config.availableWappers = {
    CONTENT_TOKENIZER : {
        class: 'contentTokenizer',
        commandTemplate: 'python /home/priit/Programs/KEELELIIN/pyutil/tokenizer.py -i [data] -o [outputPath1]'
    },
    MORFYHESTAJA : {
        class: 'morfyhestaja',
        commandTemplate: '/home/priit/Downloads/morfyhestaja/./parse.sh [data]'
    }
};

config.paramUsageTypes = {
    META: 'meta', //ei kasutata utiliidi parameetrina
    STRING : 'string', //parameeter  asendatakse väärtusega
    FILE : 'file' //parameeteri väärtus salvestatakse faili ja faili pathi kasutatakse argumendina
};

config.service = {
    title: 'Wrapper',
    description: 'Wrapperi kirjeldus',

    //Siia peab olema märgitud kõik võimalikud  parameetrid va sisendfailid
    requestBodyTemplate: {
        is_async: null//,
        //someparam: null
    },

    //Iga parameeter peab ka siin esindatud olema
    requestBodyParamsMappings: {
        is_async: {
            usageType: config.paramUsageTypes.META,
            filter: function(value){
                return value == 1;
            },
            required: true,
            allowEmpty: false,
            validator: function(value, request){ return true; }
        }/*,
         someparam: {
         usageType: config.paramUsageTypes.STRING,
         filter: function(value){
         if(value == 'yes'){
         return '-o';
         }
         return null;
         },
         required: false,
         allowEmpty: true,
         validator: function(value, request){ return true; }
         }*/
    },

    requestFiles: {
        content: null
    },

    staticParams: {
        uniqueId: 'wrapper_1',
        wrapper: config.availableWappers.MORFYHESTAJA.class,
        storagePath: "/home/priit/wrapper",
        tmpPath: "/tmp/wrapper/",
        sessionMaxLifetime: 600, //(s) Sessioonid, mille failide viimased muudatused on vanemad kui antud aeg, kustutatakse süsteemist
        //siin saab päringu parameetrite väärtused üle kirjutada
        isAsync: undefined //väärtustega true/false saab päringu väärtuse üle kirjutada
    }
};

module.exports = config;