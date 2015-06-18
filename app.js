
var server = require('./www/server');

server.startCluster(1, function ( err ) {
  console.log('Server started ' + process.pid);
});