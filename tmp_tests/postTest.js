/**
 * suurte failide upload test
 */
var request = require('request');
var fs = require('fs');
var config = require('../config');

var baseUrl = 'http://dev.bitweb.ee:3003';
//var baseUrl = 'http://127.0.0.1:8000';

var url = baseUrl + '/api/v1/service';

var path = 'keeleliin.log';

var formData = {
    "isAsync": 0,
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
        /*getData(respBody.response.sessionId, 'mapping');*/
    }
});


function getData(id, file){
    url = url + '/' + id + '/' + file;

    request.get( { url: url }, function (err, resp, body) {
        if (err) {
            console.log('Error!');
            console.log(err);
        } else {
            console.log(body);
        }
    });
}