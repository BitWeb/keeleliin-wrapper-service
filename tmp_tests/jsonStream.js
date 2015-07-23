/**
 * Loob ~1GB json objektide faili ja pasib seda striimis
 */

var fs = require('fs');
var JSONStream = require('JSONStream');

var path = 'list';

var writer = fs.createWriteStream(path);
var dataX = JSON.stringify({data: 'Helloworld', index: {value: '123'}});
dataX = dataX + dataX + dataX +dataX +dataX +dataX +dataX + dataX + dataX + dataX;
var encoding = 'utf-8';

var i = 0;
function loop(cb){
    i++;
    if(i % 100000 == 0){
        console.log(i);
    }
    if(i < 2300000){
        writer.write(dataX, encoding, function () {
            loop(cb);
        });
    } else {
        cb();
    }
}

loop( function(){ parse(); } );



function parse(){

    writer.on("finish",function (){

        var rd = fs.createReadStream(path);
        var parser = JSONStream.parse();
        rd.pipe(parser);

        var index = 0;
        parser.on('data', function (obj) {
            index++;
            if(index % 100000 == 0){
                console.log(index);
                console.log(obj); // whatever you will do with each JSON object
            }
        });
    });

    writer.end();
}




