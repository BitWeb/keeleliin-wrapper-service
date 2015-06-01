global.__base = __dirname + '/';

var express = require('express');
var app = express();


var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var debug = require('debug')('keeleliin-wrapper:server');
var http = require('http');
var config = require('./config');
var controllers = require('./controllers');

var routerMiddleware = require('./middlewares/router');
var errorhandlerMiddleware = require('./middlewares/errorhandler');

app.set('views', path.join(__dirname, 'views'));// view engine setup
app.set('view engine', 'jade');// view engine setup
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'})); // for parsing application/json
app.use(multer({ dest: './uploads/'})); // for parsing multipart/form-data
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(routerMiddleware.routeLogger);
app.use(errorhandlerMiddleware.common);

app.use(controllers);

app.use(errorhandlerMiddleware.error404);

/**
 * Create HTTP server.
 */

var port = normalizePort(config.port);
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
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
  debug('Listening on ' + bind);
}

module.exports = app;