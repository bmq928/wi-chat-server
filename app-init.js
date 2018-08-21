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

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../wi-chat-client/public','index.html'));
});
// const auth = require('./controllers/authenticate');
// app.use(auth());

// const influx = require('./database/influx');
// app.use(function (req, res, next) {
//     const start = Date.now();
//     // The 'finish' event will emit once the response is done sending
//     res.once('finish', (a) => {
//         // Emit an object that contains the original request and the elapsed time in MS
//         let duration = Date.now() - start;
//         console.log(req.originalUrl);
//         if (req.originalUrl == '/login' || req.decoded === 'undefined') {
//             next();
//         } else {
//             console.log(req.decoded.username, req.ip, req.method, req.originalUrl, `${duration}ms`);
//             influx.writePoints([
//                 {
//                     measurement: 'monitor_chat',
//                     tags: { username: req.decoded.username, path: req.originalUrl, },
//                     fields: { duration, ipaddr: req.ip, pid: process.pid },
//                 }
//             ]).catch(err => {
//                 next();
//                 console.error(`Error saving data to InfluxDB! ${err.stack}`)
//             })
//         }
//     });
//     next();
// });

app.use('/api', routesApi);
app.use('/', loginApi);

module.exports.io = io;
module.exports.app = app;
module.exports.server = server;
