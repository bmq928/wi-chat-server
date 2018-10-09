"use strict";
let response = require('./response');
var io = require('../socket.io/socket.io').io;

module.exports.getMonitor = function (req, res) {
    res.send(response(200, 'SUCCESS', io));
}
