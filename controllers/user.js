var jwt = require('jsonwebtoken');
var response = require('./response')
var models = require('../database/db-connect');
var User = models.User;
var Conversation = models.Conversation;
var Message = models.Message;
var md5 = require('md5');
var LOGIN_URL = 'http://admin.dev.i2g.cloud/login';
var LIST_USER_URL = 'https://admin.dev.i2g.cloud/user/list';
var LIST_COMPANY_URL = 'http://admin.dev.i2g.cloud/company/list';
var request = require('request');
let randomColor = require('./randomColor');
// const jwt = require('jsonwebtoken'); 

let doPost = function (req, res, url, token, callback) {
	request({
		method: 'POST',
		url: url,
		json: true,
		body: req.body,
		headers: {
			'Authorization': token
		  }
	}, function (err, response, body) {
        callback(body);
	});
}

module.exports.login = (req, res) => { 
	doPost(req, res, LOGIN_URL, '', function (body) {
		if (body.code == 200) {
			let token = body.content.token;
			if (token) {
				jwt.verify(token, 'secretKey', function (err, decoded) {
					if (err) {
						res.send(response(401, 'Login Failed' + err));
					} else if (decoded.role != 0) {
						res.send(response(401, 'Login Failed' + err));
					} else {
						User.findOne({
							where: {
								username: decoded.username
							}
						}).then(user => {
							if (user) {
								res.send(response(200, 'SUCCESSFULLY', {user: user, token: token}))
							} else {
								User.create({
									username: decoded.username,
									password: '======================',
									role: decoded.role,
                                    color: randomColor()
								}).then(user => {
									if(user) {
										res.send(response(200, 'SUCCESSFULLY', {user: user, token: token}))
									} else {
										res.send(response(404, 'NOT FOUND'));
									}
								}).catch(err => {
									console.error(err);
									res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
								});
							}
						}).catch(err => {
							console.error(err);
							res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
						});
					}
				})
			}
		} else {
			res.send(response(400, 'LOGIN FAIL', body.content))
		}
	});
}

module.exports.getListUser = (req, res) => {
	let token = req.body.token;
	doPost(req, res, LIST_USER_URL, token, function(body) {
		if (body.code == 200) {
			res.send(response(200, 'GET LIST USER SUCCESS', {body: body}))
		} else {
			res.send(response(400, 'GET LIST USER FAIL', body.content))
		}
	})
}

module.exports.getListCompany = (req, res) => {
	doPost(req, res, LIST_COMPANY_URL, '', function(body) {
		if (body.code == 200) {
			res.send(response(200, 'GET LIST COMPANY SUCCESS', {body: body}))
		} else {
			res.send(response(400, 'GET LIST COMPANY FAIL', body.content))
		}
	})
}