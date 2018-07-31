const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const routesApi = require('./routes/index');
const loginApi = require('./routes/login');
const io = require('socket.io')(server);
require('./socket.io/socket.io').socket_io.connect(io);
require('./database/db-connect');

app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, './database/upload')));
app.use(bodyParser.json());
app.use('/api', routesApi);
app.use('/', loginApi);

module.exports.io = io;
module.exports.app = app;
module.exports.server = server;
