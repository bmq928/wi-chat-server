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
app.use(express.static(path.join(__dirname, './database/upload')));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../wi-chat-client/public')));

app.get('/', function (req, res) {
    const crypto = require('crypto');

    function getRandomHash() {
        const current_date = (new Date()).valueOf().toString();
        const random = Math.random().toString();
        return (crypto.createHash('sha1').update(current_date + random).digest('hex'));
    }
    res.send({
        serverId: getRandomHash()
    });
})

//const influx = require('./database/influx');
//app.use(function (req, res, next) {
//res.once('finish', (a) => {
////console.log('influx');
//if (req.originalUrl == '/login' || req.decoded === 'undefined') {
//next();
//} else {
//console.log(req.decoded.username, req.ip, req.method, req.originalUrl);
////influx.writePoints([
////{
////measurement: 'monitor_chat',
////tags: { username: req.decoded.username, path: req.originalUrl },
////fields: { num: 1 },
////}
////]).catch(err => {
////next();
////console.error(`Error saving data to InfluxDB! ${err.stack}`)
////})
//}
//});
//next();
//});

app.use('/api', routesApi);
app.use('/', loginApi);

module.exports.io = io;
module.exports.app = app;
module.exports.server = server;
