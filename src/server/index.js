const http = require('http');
const express = require('express');
const hbs = require('express-handlebars');
const debug = require('debug')('node:server');
const mongoose = require('mongoose');
const PubSub = require('pubsub-js');

const apiSetup = require('./api');
const gameCoreSetup = require('./game-core');
const backofficeSetup = require('./backoffice');
const port = process.env.PORT

const app = express();
const server = http.createServer(app);

mongoose.connect(process.env.MONGO_CONNECTIONSTRING);

app.engine('hbs', hbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

gameCoreSetup(app, server, PubSub, mongoose);
apiSetup(app, server, PubSub, mongoose);
backofficeSetup(app, server, PubSub, mongoose);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if(error.syscall !== 'listen'){
        throw error;
    }

    const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

    switch(error.code) {
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

function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr 
        : 'port ' + addr.port

    debug('Listening on: ' + addr);
}




