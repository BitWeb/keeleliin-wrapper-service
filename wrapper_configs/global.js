var config = {};

config.redis = {
    host: process.env.REDIS_PORT_6379_TCP_ADDR || "127.0.0.1",
    port: process.env.REDIS_PORT_6379_TCP_PORT || 6379
};

config.serverUrl = 'http://dev.bitweb.ee';

config.integration = {
    installUrl: 'http://dev.bitweb.ee:3000/api/v1/service/install',
    apiKey: 'server-wrapper-api-key'
};

config.fs = {
    storagePath: "/wrapper/files",
    tmpPath: "/wrapper/tmp"
};

config.paramUsageTypes = {
    META: 'meta', //ei kasutata utiliidi parameetrina
    STRING: 'string', //parameeter  asendatakse väärtusega
    FILE: 'file' //parameeteri väärtus salvestatakse faili ja faili pathi kasutatakse argumendina
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

config.wrapper = {
    id: null, // unique service identifier
    title: null,
    description: '',
    port: null,
    class: null,
    command: null,
    requestConf: null
};

config.availableCommands = {
    TOKENIZER: {
        commandTemplate: 'python /var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/picoutils/tokenizer.py -i [data] -o [output]'
    },
    MORFANALYSAATOR: {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./morfanalyzer.sh [data]'
    },
    LAUSESTAJA: {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./lausestaja.sh [data]'
    },
    OSALAUSESTAJA: {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./osalausestaja.sh [data]'
    },
    MORFYHESTAJA: {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./morfyhestaja.sh [data]'
    },
    PIND_SYN: {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./pindsyn.sh [data]'
    },
    S6LT_SYN: {
        commandTemplate: '/var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/./s6ltsyn.sh [data]'
    },
    CONCAT: {
        commandTemplate: 'cat [data]'
    },
    MORPH_TAGGER: {
        commandTemplate: 'python /var/www/bitweb.ee/keeleliin.bitweb.ee/wrapper/utils/picoutils/morph_tagger.py -i [data] -o [output]'
    }
};

var isAsyncParamValue = {
    type: 'select',
    options: ['0', '1'],
    value: '1',
    usageType: config.paramUsageTypes.META,
    filter: function (value) {
        return value == 1;
    },
    required: true,
    allowEmpty: false,
    validator: function (value, request) {
        return true;
    }
};

var stringKeyValue = {
    type: 'text',
    value: undefined,
    usageType: config.paramUsageTypes.STRING,
    filter: null,
    required: false,
    allowEmpty: true,
    validator: function(value, request){
        return true;
    }
};

var fileKeyValue = {
    type: 'text',
    value: undefined,
    usageType: config.paramUsageTypes.FILE,
    filter: null,
    required: false,
    allowEmpty: true,
    validator: function(value, request){
        return true;
    }
};

config.availableWrappers = {

    LAUSESTAJA: {
        title: 'Lausestaja',
        description: '',
        id: 'lau',
        port: 3001,
        class: 'simpleLocalCommand',
        command: config.availableCommands.LAUSESTAJA,
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
            },
            requestFiles: {
                content: {
                    type: 'text',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            }
        },
        outputTypes: [
            {
                type: 'lau_a',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    },
    MORFANALYSAATOR: {
        title: 'Morfoloogiline analüüs',
        description: '',
        id: 'moa',
        port: 3002,
        class: 'simpleLocalCommand',
        command: config.availableCommands.MORFANALYSAATOR,
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
            },
            requestFiles: {
                content: {
                    type: 'lau_a',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            }
        },
        outputTypes: [
            {
                type: 'moa_a',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    },
    OSALAUSESTAJA: {
        title: 'Osalausestaja',
        description: '',
        id: 'osl',
        port: 3003,
        class: 'simpleLocalCommand',
        command: config.availableCommands.OSALAUSESTAJA,
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
            },
            requestFiles: {
                content: {
                    type: 'moa_a',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            }
        },
        outputTypes: [
            {
                type: 'osl_a',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    },
    MORFYHESTAJA: {
        title: 'Morfoloogiline ühestamine (kitsenduste grammatika)',
        description: '',
        id: 'moy',
        port: 3004,
        class: 'simpleLocalCommand',
        command: config.availableCommands.MORFYHESTAJA,
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
            },
            requestFiles: {
                content: {
                    type: 'osl_a',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            }
        },
        outputTypes: [
            {
                type: 'moy_a',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    },
    PIND_SYN: {
        title: 'Pindsüntaktiline analüüs',
        description: '',
        id: 'pia',
        port: 3005,
        class: 'simpleLocalCommand',
        command: config.availableCommands.PIND_SYN,
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
            },
            requestFiles: {
                content: {
                    type: 'moy_a',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            }
        },
        outputTypes: [
            {
                type: 'pia_a',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    },
    S6LT_SYN: {
        title: 'Sõltuvussüntaktiline analüüs (ja järeltöötlus)',
        description: '',
        id: 's6a',
        port: 3006,
        class: 'simpleLocalCommand',
        command: config.availableCommands.S6LT_SYN,
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
            },
            requestFiles: {
                content: {
                    type: 'pia_a',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            }
        },
        outputTypes: [
            {
                type: 's6a_a',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    },

    ARCHIVE_EXTRACTOR: {
        title: 'Arhiivi lahtipakkija',
        description: '',
        id: 'uzip',
        port: 3007,
        class: 'archiveExtractor',
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
            },
            requestFiles: {
                content: {
                    type: 'zip',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            }
        },
        outputTypes: [
            {
                type: 'text',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    },
    TOKENIZER: {
        title: 'Sõnestaja pipe',
        description: '',
        id: 'tok',
        port: 3008,
        class: 'inputOutputLocalCommand',
        command: config.availableCommands.TOKENIZER,
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
            },
            requestFiles: {
                content: {
                    type: 'text',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            }
        },
        outputTypes: [
            {
                type: 'tok_a',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    },
    CONCAT: {
        title: 'Lihtne konkateneerija',
        id: 'concat',
        port: 3009,
        class: 'simpleLocalCommand',
        command: config.availableCommands.CONCAT,
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
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
        outputTypes: [
            {
                type: 'text',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    },
    MORPH_TAGGER: {
        title: 'Morfoloogiline ühestaja pipe',
        id: 'tag',
        port: 3010,
        class: 'inputOutputLocalCommand',
        command: config.availableCommands.MORPH_TAGGER,
        requestConf: {
            requestBodyParamsMappings: {
                isAsync: isAsyncParamValue
            },
            requestFiles: {
                content: {
                    type: 'text',
                    sizeLimit: 0,
                    sizeUnit: 'byte',
                    isList: false
                }
            }
        },
        outputTypes: [
            {
                type: 'tag_a',
                key: 'output'
            }
        ],
        sessionMaxLifetime: 600
    }
};

module.exports = config;