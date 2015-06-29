/**
 * suurte failide upload test
 */
var request = require('request');
var fs = require('fs');
var config = require('../config');

var url = 'http://127.0.0.1:' + config.port + '/api/v1/service';

var path = 'keeleliin.log';

var formData = {
    "is_async": 0,
    "someparam": 'no',
    "content": fs.createReadStream(path)
};

request.post( { url: url, formData: formData }, function (err, resp, body) {
    if (err) {
        console.log('Error!');
        console.log(err);
    } else {
        console.log('URL: ' + body);

        var respBody = JSON.parse(resp.body);

        getData(respBody.response.serviceId, 'output');
        /*getData(respBody.response.serviceId, 'mapping');*/
    }
});


function getData(id, file){
    url = 'http://127.0.0.1:' + config.port + '/api/v1/service/' + id + '/' + file;

    request.get( { url: url }, function (err, resp, body) {
        if (err) {
            console.log('Error!');
            console.log(err);
        } else {
            console.log(body);
        }
    });
}