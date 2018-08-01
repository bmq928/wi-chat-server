var jwt = require('jsonwebtoken');
var response = require('./response')
var models = require('../database/db-connect');
var User = models.User;
var Conversation = models.Conversation;
var Message = models.Message;
var md5 = require('md5');
var LOGIN_URL = 'http://admin.dev.i2g.cloud/login';
var request = require('request');
// const jwt = require('jsonwebtoken'); 

let doPost = function (req, res, callback) {

	request({
		method: 'POST',
		url: LOGIN_URL,
		json: true,
		body: req.body
	}, function (err, response, body) {
		callback(body);
	});
}

module.exports.login = (req, res) => { 
	doPost(req, res, function (body) {
		if (body.code == 200) {
			console.log(body.content.company);
			let token = body.content.token;
			if (token) {
				jwt.verify(token, 'secretKey', function (err, decoded) {
					if (err) {
						res.send(response(401, 'Login Failed' + err));
					} else {
						console.log(decoded);
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
									role: decoded.role
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

module.exports.register = (req, res) => {
	User.create({
		username: req.body.username,
		password: md5(req.body.password),
		role: req.body.role
	}).then(user => {
		if (user)
			res.send(response(200, 'SUCCESSFULLY', user));
		else
			res.send(response(404, 'NOT FOUND'));
	}).catch(err => {
		console.error(err);
		res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
	});
}
module.exports.getUser = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (user) {
			res.send(response(200, 'SUCCESSFULLY', user));
		} else {
			res.send(response(404, 'NOT FOUND'));
		}
	}).catch(err => {
		console.error(err);
		res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
	});
}

