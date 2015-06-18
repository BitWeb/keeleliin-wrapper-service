/**
 * Created by priit on 26.05.15.
 */

/*
var FileUtil = require('../src/util/file');
FileUtil.cp('./12m', '13m', function () {
    console.log('Copied');
});*/

require('../app');

return;


var tmp = [];
var index = 0;
while(index < 100000000){
    index++;
    if(index % 1000000 == 0){
        console.log(index);
    }
    // 75 200 000 with no param
    //--max_old_space_size=4000
    // 112 800 000
    //112800000
    tmp.push('Helloworld');
}

JSON.stringify({arr: tmp});


/////////////////////////

return;
var fs = require('fs');
var tmp = [];
var index = 0;
while(true){
    index++;
    if(index % 10 == 0){
        console.log(index);
    }

    tmp.push(fs.readFileSync('13m').toString());


    // 75 200 000 with no param
    //--max_old_space_size=4000
    // 112 800 000
    //112800000

}
