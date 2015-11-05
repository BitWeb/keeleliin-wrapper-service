var config = require('./global_config/global');

/*
 *	Teenuse url ilma pordita. Kasutatakse teenuse serverisse installeerimisel teenuse urli moodustamiseks: <url>:<port>/api/v1/
 */
config.serverUrl = 'http://localhost';

/*
 *	Redis serveri andmed. Kui kasutatakse vaikeseadeid, siis pole vaja muuta
 */
//config.redis = {
//    host: process.env.REDIS_PORT_6379_TCP_ADDR || "127.0.0.1",
//    port: process.env.REDIS_PORT_6379_TCP_PORT || 6379
//};

/*
 * 	Nimekiri keeleliini serverirakendustest, kuhu teenuse käivitamisel see installeeritakse.
 */
//config.integration = [
//    {
//        installUrl: 'http://keeleliin.keeleressursid.ee:3000/api/v1/service/install',
//        apiKey: 'server-wrapper-api-key'
//    }
//];

/*
 *	Teenuse failide salvestamise asukohad
 */
//config.fs = {
//    storagePath: '/wrapper/files',
//    tmpPath: '/wrapper/tmp'
//};

/*
 *	Kui teenuse töös peaks tekkima vigu ja selle kohta soovitakse veadeadet emailile saada,
 *	siis tuleks see sisse kommenteerida ja *** väjad täita
 */
/* config.log4js.appenders.push({
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
         "recipients": "***@***.***", //komaga eraldatult eposti aadressid
         "sendInterval": 10, //sec
         "transport": "SMTP",
             "SMTP": {
                 "host": "smtp.gmail.com",
                 "secureConnection": false,
                 "port": 587,
                     "auth": {
                         "user": "***",
                         "pass": "***"
                     },
                 "debug": true
             }
         }
    }
 );
 */

config.wrapper = { //teenuse seadistus
    id: 'concat', // Unikaalne lühinimi
    title: 'Lihtne konjateneerija', //Avalik nimi
    description: 'Konkateneerib etteantud failid üheks suureks failiks', //Kirjeldus
    port: 3000, //port
    class: 'simpleLocalCommand',    //wrapperi failinimi wrapper kaustast, mida utiliidi käivitamiseks kasutatakse
    command: 'cat [data]',  // utiliidi käsurea käsk
    requestConf: { //Päringu seadistus
        requestBodyParamsMappings: { //Päringu post parameetrid
            isAsync: { //parameeter isAsync
                type: config.paramTypes.SELECT, //Tüüp. Võimalikud väärtused: config.paramTypes.SELECT ja config.paramTypes.TEXT
                options: ['0', '1'], //Võimalikud sobivad väärtused
                value: '1', //Soovituslik vaikeväärtus
                filter: function (value) { //parameerile rakendatav filter. Antud juhul viiaks väärtus boolean kujule
                    return value == 1;
                },
                required: true, //kas mittetühi väärtus on nõutud
                allowEmpty: false, //kas parameeter peab olema saadetud
                validator: function (value, request) { //filtreeritud väärtuse valideerimine
                    if( typeof value != 'boolean' ){
                        request.setMessage('isAsync', 'Peab olema boolean');
                        return false;
                    }
                    return true;
                }
            }
        },
        requestFiles: { //Päringuga saadetavad failid
            content: { //Faili võti
                type: 'text', //Ressursi tüübi võti
                sizeLimit: 0, //Suuruse piirang
                sizeUnit: 'byte',//Suuruse piirangu ühik
                isList: true //Kas tegemist võib olla ka failide listuga
            }
        }
    },
    outputTypes: [ //teenuse väljundressursside kirjldused
        {
            type: 'text',   //ressursi tüüp
            key: 'output'   //väljundressursi võti
        }
    ],
    sessionMaxLifetime: 600 // sessiooni maksimaalne kestvus
};

module.exports = config;