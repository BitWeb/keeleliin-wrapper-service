/**
 * Created by priit on 26.05.15.
 */

var config = {};

config.port = 8000;

config.redis = {
    host: "127.0.0.1",
    port: 6379
};

/* kasutatavad teenuste tüübid */
config.serviceTypes = {
    LOCAL: 'LOCAL' //Kohalik commandline programm
};

config.paramUsageTypes = {
    STRING : 'string',
    FILE : 'file' //parameeteri väärtus salvestatakse faili ja faili pathi kasutatakse argumendina
};

config.paramEncodings = {
    BASE64 : 'base64'
};

config.service = {
    title: 'Teenuse wrapper',
    description: 'Wrapperi kirjeldus',

    staticOptions: {
        type: config.serviceTypes.LOCAL, //Kohaliku commandline programm
        commandTemplate: 'grep [query] [data] [showLineNumbers]', //grep "ls" lsFile.txt -n
        isAsync: null, //väärtustega true/false saab päringu väärtuse üle kirjutada
        storagePath: "/home/priit/wrapper"
    },

    //Siia peab olema märgitud kõik võimalikud metaandmed ja parameetrid
    serviceRequestTemplate: {
        service: {
            meta: { //key: value
                isAsync: true, // vaikimisi on teenus asünkroone,
                sessionId: null // vaikimisi seda ei määrata
            },
            params: { //key: value
                showLineNumbers: 'yes',
                query: null,
                data: null
            }
        }
    },

    //Iga parameeter peab ka siin esindatud olema
    paramsMappings: {
        query: {
            usageType: config.paramUsageTypes.STRING,
            filter: function(value){ return value; },
            required: true,
            allowEmpty: false,
            validator: function(value, request){ return true; },
            encoding: null
        },
        showLineNumbers: {
            usageType: config.paramUsageTypes.STRING,
            filter: function(value){
                var mapping = {
                    yes: '-n',
                    no: null
                };
                if(mapping[value]){
                    return mapping[value];
                }
                return null;
            },
            required: false,
            allowEmpty: true,
            validator: function(value, request){ return true; },
            encoding: null
        },
        data: {
            usageType: config.paramUsageTypes.FILE,
            filter: function(value){ return value; },
            required: true,
            allowEmpty: false,
            validator: function(value, request){ return true; },
            encoding: config.paramEncodings.BASE64
        }
    }
};

module.exports = config;