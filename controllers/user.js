var jwt = require('jsonwebtoken');
var response = require('./response')
var models = require('../database/db-connect');
var User = models.User;
var Conversation = models.Conversation;
var Message = models.Message;
var md5 = require('md5');

module.exports.login = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username,
			password: md5(req.body.password)
		}
	}).then(user => {
		var token = jwt.sign(req.body, 'secretKey');
		if (user) {
			res.send(response(200, 'SUCCESSFULLY', {user: user, token: token}));
		} else {
			res.send(response(404, 'NOT FOUND'));
		}
	}).catch(err => {
		console.error(err);
		res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
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

