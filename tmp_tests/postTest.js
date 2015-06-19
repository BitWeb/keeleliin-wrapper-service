/**
 * suurte failide upload test
 */
var request = require('request');
var fs = require('fs');
var config = require('../config');

var url = 'http://127.0.0.1:' + config.port + '/api/v1/service';

var path = 'list';

var formData = {
    "service[meta][isAsync]":"0",
    "service[pipecontent][content]": 'data',

    file1: {
        value: fs.createReadStream(path),
        options: {
            filename: 'topsecret.json',
            contentType: 'text/json'
        }
    },
    file2: {
        value: fs.createReadStream(path),
        options: {
            filename: 'topsecret.json',
            contentType: 'text/json'
        }
    },
    file3: {
        value: fs.createReadStream(path),
        options: {
            filename: 'topsecret.json',
            contentType: 'text/json'
        }
    },
    file4: {
        value: fs.createReadStream(path),
        options: {
            filename: 'topsecret.json',
            contentType: 'text/json'
        }
    },
    file5: {
        value: fs.createReadStream(path),
        options: {
            filename: 'topsecret.json',
            contentType: 'text/json'
        }
    }
};

request.post( { url: url, formData: formData }, function (err, resp, body) {
    if (err) {
        console.log('Error!');
    } else {
        console.log('URL: ' + body);
    }
});
