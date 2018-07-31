var models = require('../database/db-connect');
var response = require('./response');
var User = models.User;
var Conversation = models.Conversation;
var Message = models.Message;
var NewMessage = models.NewMessage;
var Op = models.Op;
var socket_io = require('../socket.io/socket.io').socket_io;
var async = require('async');

module.exports.getConversation = (req, res) => {
	Conversation.findOne({
		where: { name: req.body.name },
		include: {
			model: Message,
			include: {
				model: User
			}
		},
        order: [[Message, 'sendAt', 'ASC']]
	}).then(conver => {
		if (conver) {
			let numNewMess = 0;
			conver.addUsers([req.decoded.id]);
			getNewMess(req.decoded.id, req.body.name, function(rs) {
				if(rs==1) {
					numNewMess++;
					conver.dataValues.lastMessFontWeight = "bolder";
				}
				res.send(response(200, 'SUCCESSFULLY', {user: req.decoded, conver: conver, numNewMess: numNewMess}));
			})
		} else {
			Conversation.create({
				name: req.body.name
			}).then(conver => {
				if(conver) {
					conver.addUsers([req.decoded.id]);
					if(conver.name.indexOf('Help_Desk')!=-1) (socket_io.socket).broadcast.emit('join-help-desk', conver);
					res.send(response(200, 'SUCCESSFULLY', {user: req.decoded, conver: conver}));
				}
				else res.send(response(404, 'NOT FOUND & CREATE FAIL'));
			}).catch(err => {
				console.error(err);
				res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
			});
		}
	}).catch(err => {
		console.error(err);
		res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
	})
}

module.exports.getListConversation = (req, res) => {
	Conversation.findAll({
		where: {
			name: { [Op.like]: 'Help_Desk-%' }
		},
		include: {
			model: Message,
			include: {
				model: User
			}
		},
        order: [[Message, 'sendAt', 'ASC']]
	}).then(list => {
		if (list) {
			let numNewMess = 0;
			async.forEachOfSeries(list, function(conver, i, cb) {
				conver.addUsers([req.decoded.id]);
				getNewMess(req.decoded.id, conver.name, function(rs) {
					if(rs==1) {
						conver.dataValues.lastMessFontWeight = "bolder";
						numNewMess++;
					}
					cb();
				})
			}, function(err) {
				if(err) res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
				else {
					res.send(response(200, 'SUCCESSFULLY', {list: list, numNewMess: numNewMess}));
				}
			})
		} else {
			console.error('No conversation');
			res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
		}
	}).catch(err => {
		console.error(err);
		res.send(response(400, 'SOMETHING WENT WRONG: ' + err));
	})
}

function getNewMess(idUser, nameConversation, cb) {
	NewMessage.findOne({
		where: {
			nameConversation: nameConversation,
			idUser: idUser
		}
	}).then(newMess => {
		if(newMess) cb(1);
		else cb(-1);
	}).catch(err => {
		cb(-1);
	});
}