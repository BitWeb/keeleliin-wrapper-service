/**
 * Created by priit on 26.05.15.
 */

var config = {};

config.port = 8000;

config.redis = {
    host: "127.0.0.1",
    port: 6379
};

config.serviceTypes = {
    LOCAL: 'LOCAL'
};

config.availableWappers = {
    CONTENT_TOKENIZER : 'contentTokenizer'
};

config.paramUsageTypes = {
    STRING : 'string', //parameeter  asendatakse väärtusega
    FILE : 'file' //parameeteri väärtus salvestatakse faili ja faili pathi kasutatakse argumendina
};

config.service = {
    title: 'Wrapper',
    description: 'Wrapperi kirjeldus',

    //Siia peab olema märgitud kõik võimalikud metaandmed ja parameetrid
    serviceRequestTemplate: {
        service: {
            meta: { //key: value
                isAsync: null // vaikimisi on teenus asünkroone,
            },
            params: {
                //data: null,
                //showLineNumbers: null
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
         },*/
        /*showLineNumbers: {
         usageType: config.paramUsageTypes.STRING,
         filter: function(value){
         if(value == 'yes'){
         return '-o';
         }
         return null;
         },
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
        wrapper: config.availableWappers.CONTENT_TOKENIZER,
        type: config.serviceTypes.LOCAL, //Kohaliku commandline programm
        commandTemplate: 'python /home/priit/Programs/KEELELIIN/pyutil/tokenizer.py -i [data] -o [outputPath]',
        isAsync: null, //väärtustega true/false saab päringu väärtuse üle kirjutada
        storagePath: "/home/priit/wrapper"
    }

};

module.exports = config;