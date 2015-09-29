
var config = {};

config.redis = {
    host: "127.0.0.1",
    port: 6379
};


config.serverUrl = 'http://localhost';

config.integration = {
    installUrl: 'http://dev.bitweb.ee:8000/api/v1/service/install',
    apiKey: 'server-wrapper-api-key'
};

config.fs = {
    storagePath: "/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/tmp",
    tmpPath: "/tmp/wrapper/"
};

config.paramUsageTypes = {
    META: 'meta', //ei kasutata utiliidi parameetrina
    STRING : 'string', //parameeter  asendatakse väärtusega
    FILE : 'file' //parameeteri väärtus salvestatakse faili ja faili pathi kasutatakse argumendina
};

config.wrapper = {
    id: null, // unique service identifier
    title: null,
    description: '',
    port: null,
    class: null,
    command: null,
    requestConf: null
};

config.log4js = {
    appenders: [
        {
            "type": "logLevelFilter",
            "level": "ERROR",
            "appender": {
                type: 'console',
                layout: {
                    type: 'pattern',
                    pattern: "[%d] %[[%x{port}-%x{pid}][%5.5p]%] %c - %m",
                    tokens: {
                        pid: process.pid,
                        port: function () {
                            return config.wrapper.port;
                        }
                    }
                }
            }
        },
        {
            "type": "logLevelFilter",
            "level": "ERROR",
            "appender": {
                type: 'file',
                filename: __dirname + '/../wrapper.log',
                layout: {
                    type: 'pattern',
                    pattern: "[%d] %[[%x{port}-%x{pid}][%5.5p]%] %c - %m",
                    tokens: {
                        pid: process.pid,
                        port: function () {
                            return config.wrapper.port;
                        }
                    }
                }
            }
        }
    ]
};

/*var someCommandRequest = {
    requestBodyTemplate: {
        isAsync: null//,
        someparam: null
    },
    requestBodyParamsMappings: {
        isAsync: {
            usageType: config.paramUsageTypes.META,
            filter: function(value){
                return value == 1;
            },
            required: true,
            allowEmpty: false,
            validator: function(value, request){ return true; }
        },
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
         validator: function(value, request){
             return true;
            }
         }
    },
    requestFiles: {
        content: null
    },
    staticParams: {
        sessionMaxLifetime: 600, //(s) Sessioonid, mille failide viimased muudatused on vanemad kui antud aeg, kustutatakse süsteemist
        //siin saab päringu parameetrite väärtused üle kirjutada
        isAsync: undefined //väärtustega true/false saab päringu väärtuse üle kirjutada
    }
};*/

var simpleCommandRequest = {
    requestBodyTemplate: {
        isAsync: null
        //key: null
    },
    requestBodyParamsMappings: {
        isAsync: {
            type: 'select',
            options: ['0','1'],
            usageType: config.paramUsageTypes.META,
            filter: function (value) {
                return value == 1;
            },
            required: true,
            allowEmpty: false,
            validator: function (value, request) {
                return true;
            }
        }
        /**
         *   , key: {
            type: 'text',
            usageType: config.paramUsageTypes.STRING,
            filter: function(value){
                return value == 1;
            },
            required: true,
            allowEmpty: false,
            validator: function(value, request){ return true; }
        }
         */
    },
    requestFiles: {
        content: {
            type: 'text',
            sizeLimit: 0,
            sizeUnit: 'byte',
            isList: false
        }
    },
    staticParams: {
        sessionMaxLifetime: 600,
        isAsync: undefined
    },
    outputTypes: [
        {
            type: 'text',
            key: 'output'
        }
    ]
};

config.availableCommands = {
    TOKENIZER : {
        commandTemplate: 'python /var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/picoutils/tokenizer.py -i [data] -o [output]'
    },
    MORFANALYSAATOR : {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./morfanalyzer.sh [data]'
    },
    LAUSESTAJA : {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./lausestaja.sh [data]'
    },
    OSALAUSESTAJA : {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./osalausestaja.sh [data]'
    },
    MORFYHESTAJA : {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./morfyhestaja.sh [data]'
    },
    PIND_SYN : {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./pindsyn.sh [data]'
    },
    S6LT_SYN : {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./s6ltsyn.sh [data]'
    },
    CONCAT : {
        commandTemplate: 'cat [data]'
    },
    MORPH_TAGGER : {
        commandTemplate: 'python /var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/picoutils/morph_tagger.py -i [data] -o [output]'
    }
};

config.availableWrappers = {

    LAUSESTAJA : {
        title: 'Lausestaja',
        description: '',
        id: 'lau',
        port: 3001,
        class: 'simpleLocalCommand',
        command: config.availableCommands.LAUSESTAJA,
        requestConf: simpleCommandRequest,
        outputTypes: [ { type: 'text', key: 'output' }]
    },
    MORFANALYSAATOR : {
        title: 'Morfoloogiline analüüs',
        description: '',
        id: 'moa',
        port: 3002,
        class: 'simpleLocalCommand',
        command: config.availableCommands.MORFANALYSAATOR,
        requestConf: simpleCommandRequest,
        outputTypes: [ { type: 'text', key: 'output' }]
    },
    OSALAUSESTAJA : {
        title: 'Osalausestaja',
        description: '',
        id: 'osl',
        port: 3003,
        class: 'simpleLocalCommand',
        command: config.availableCommands.OSALAUSESTAJA,
        requestConf: simpleCommandRequest,
        outputTypes: [ { type: 'text', key: 'output' }]
    },
    MORFYHESTAJA: {
        title: 'Morfoloogiline ühestamine (kitsenduste grammatika)',
        description: '',
        id: 'moy',
        port: 3004,
        class: 'simpleLocalCommand',
        command: config.availableCommands.MORFYHESTAJA,
        requestConf: simpleCommandRequest,
        outputTypes: [ { type: 'text', key: 'output' }]
    },
    PIND_SYN: {
        title: 'Pindsüntaktiline analüüs',
        description: '',
        id: 'pia',
        port: 3005,
        class: 'simpleLocalCommand',
        command: config.availableCommands.PIND_SYN,
        requestConf: simpleCommandRequest,
        outputTypes: [ { type: 'text', key: 'output' }]
    },
    S6LT_SYN: {
        title: 'Sõltuvussüntaktiline analüüs (ja järeltöötlus)',
        description: '',
        id: 's6a',
        port: 3006,
        class: 'simpleLocalCommand',
        command: config.availableCommands.S6LT_SYN,
        requestConf: simpleCommandRequest,
        outputTypes: [ { type: 'text', key: 'output' }]
    },

    ARCHIVE_EXTRACTOR: {
        title: 'Arhiivi lahtipakkija',
        description: '',
        id: 'uzip',
        port: 3007,
        class: 'archiveExtractor',
        requestConf: {
            requestBodyTemplate: {
                isAsync: null
            },
            requestBodyParamsMappings: {
                isAsync: {
                    type: 'select',
                    options: ['0','1'],
                    usageType: config.paramUsageTypes.META,
                    filter: function (value) {
                        return value == 1;
                    },
                    required: true,
                    allowEmpty: false,
                    validator: function (value, request) {
                        return true;
                    }
                }
            },
            requestFiles: {
                content: {
                    type: 'zip',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            },
            staticParams: {
                sessionMaxLifetime: 600,
                isAsync: 0
            }
        },
        outputTypes: [ { type: 'text', key: 'output' }]
    },
    TOKENIZER : {
        title: 'Sõnestaja pipe',
        description: '',
        id: 'tok',
        port: 3008,
        class: 'inputOutputLocalCommand',
        command: config.availableCommands.TOKENIZER,
        requestConf: simpleCommandRequest,
        outputTypes: [ { type: 'text', key: 'output' }]
    },
    CONCAT : {
        title: 'Lihtne konkateneerija',
        id: 'concat',
        port: 3009,
        class: 'simpleLocalCommand',
        command: config.availableCommands.CONCAT,
        requestConf: {
            requestBodyTemplate: {
                isAsync: null,
                key: null
            },
            requestBodyParamsMappings: {
                isAsync: {
                    type: 'select',
                    options: ['0','1'],
                    usageType: config.paramUsageTypes.META,
                    filter: function (value) {
                        return value == 1;
                    },
                    required: true,
                    allowEmpty: false,
                    validator: function (value, request) {
                        return true;
                    }
                }, key: {
                    type: 'text',
                    usageType: config.paramUsageTypes.STRING,
                    filter: function(value){
                        return value == 1;
                    },
                    required: true,
                    allowEmpty: false,
                    validator: function(value, request){ return true; }
                }
            },
            requestFiles: {
                content: {
                    type: 'text',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: true
                }
            },
            staticParams: {
                sessionMaxLifetime: 600,
                isAsync: undefined
            }
        },
        outputTypes: [ { type: 'text', key: 'output' }]
    },
    MORPH_TAGGER : {
        title: 'Morfoloogiline ühestaja pipe',
        id: 'tag',
        port: 3010,
        class: 'inputOutputLocalCommand',
        command: config.availableCommands.MORPH_TAGGER,
        requestConf: simpleCommandRequest,
        outputTypes: [ { type: 'text', key: 'output' }]
    }
};

module.exports = config;