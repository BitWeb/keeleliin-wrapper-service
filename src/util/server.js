/**
 * Created by priit on 18.06.15.
 */

var Server = {

    normalizePort: function(val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    },

    onError: function(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error('Port requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error('Port is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
};

module.exports = Server;
