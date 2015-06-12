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
    LOCAL: 'LOCAL'
};

config.paramUsageTypes = {
    STRING : 'string',
    FILE : 'file' //parameeteri väärtus salvestatakse faili ja faili pathi kasutatakse argumendina
};

config.paramEncodings = {
    BASE64 : 'base64'
};

config.service = {
    title: 'Wrapper',
    description: 'Wrapperi kirjeldus',

    //Siia peab olema märgitud kõik võimalikud metaandmed ja parameetrid
    serviceRequestTemplate: {
        service: {
            meta: { //key: value
                isAsync: null, // vaikimisi on teenus asünkroone,
                sessionId: null // vaikimisi seda ei määrata
            },
            params: {
                //data: null
            },
            pipecontent: null
        }
    },

    //Iga parameeter peab ka siin esindatud olema
    paramsMappings: {
        /*data: {
         usageType: config.paramUsageTypes.FILE,
         filter: function(value){ return value; },
         required: true,
         allowEmpty: false,
         validator: function(value, request){ return true; }
         }*/
    },

    pipecontentMapping: {
        validator: function(value, request){
            if(!value || !value.content){
                request.setMessage('pipecontent', 'Puuduvad lähteandmed');
            }
            return true;
        }
    },

    staticOptions: {
        type: config.serviceTypes.LOCAL, //Kohaliku commandline programm
        commandTemplate: 'python /home/priit/Programs/KEELELIIN/pyutil/tokenizer.py -i [data] -o [outputPath]',
        isAsync: null, //väärtustega true/false saab päringu väärtuse üle kirjutada
        storagePath: "/home/priit/wrapper"
    }

};

module.exports = config;