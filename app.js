global.__base = __dirname + '/';

var express = require('express');
var app = express();

var log4js = require('log4js');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var debug = require('debug')('keeleliin-wrapper:server');

var cluster = require('cluster');
var http = require('http');
var config = require('./config');
var controllers = require('./controllers');
var routerMiddleware = require('./middlewares/router');
var errorhandlerMiddleware = require('./middlewares/errorhandler');
app.set('views', path.join(__dirname, 'views'));// view engine setup
app.set('view engine', 'jade');// view engine setup
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'keeleliin.log' }
  ]
});
var log4jsLogger = log4js.getLogger('app_js');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '1000mb'})); // for parsing application/json
app.use(multer({ dest: './uploads/'})); // for parsing multipart/form-data
app.use(express.static(path.join(__dirname, 'public')));
app.use(routerMiddleware.routeLogger);
app.use(errorhandlerMiddleware.common);
app.use(controllers);
app.use(errorhandlerMiddleware.error404);

/**
 * Create HTTP server.
 */
var numCPUs = require('os').cpus().length;
log4jsLogger.debug('NumCPUs: ' + numCPUs);
///
if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    log4jsLogger.info('worker ' + worker.process.pid + ' died; Code' + code + '; Signal: ' + signal);
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  var port = normalizePort(config.port);
  app.set('port', port);
  var server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  log4jsLogger.debug('Listening on ' + bind);
}

module.exports = app;