var models = require('../database/db-connect');
var response = require('./response')
var Message = models.Message;
var NewMessage = models.NewMessage;
var User = models.User;
var Conversation = models.Conversation;
var appProfile = require('../app-init');
var op = models.Op;
var async = require('async');

module.exports.postMessage = (req, res) => {
	Message.create({
		content: req.body.content,
		type: req.body.type,
		idConversation: req.body.idConversation,
		idSender: req.body.idSender,
        sendAt: req.body.sendAt
	}).then(message => {
		if (message) {
			abc(req.body.idSender, req.body.idConversation, function(rs) {
				if(rs==1) {
					appProfile.io.in(req.body.idConversation).emit('sendMessage', req.body);
					res.send(response(200, 'SUCCESSFULLY', message));
				} else {
					res.send(response(404, 'CREATE NEWMESSAGE ERROR'));
				}
			})
		}
		else
			res.send(response(400, 'CREATE FAIL'));
	}).catch(err => {
		console.error(err);
		res.send(response(404, 'SOMETHING WENT WRONG: ' + err));
	});
}

function abc(idUser, idConversation, cb) {
	Conversation.findOne({
		where: {
			id: idConversation
		},
		include: {
			model: User
		}
	}).then(conver => {
		if(conver) {
			if(conver.dataValues.Users)
			async.eachOfSeries(conver.dataValues.Users, function(user, i, done) {
				if(user.dataValues.id!=idUser)
				NewMessage.create({
					idUser: user.dataValues.id,
					nameConversation: conver.dataValues.name
				}).then(newMess => {
					if(newMess) done();
					else console.log('new Mess empty') && cb(-1)  ;
				}).catch(err => {
					console.log('create new mess err', err) && cb(-1) ;
				});else done();
			}, function(err) {
				if(err)  console.log('async', err) && cb(-1);
				cb(1);
			})
			else cb(1);
		} else console.log('conver null') && cb(-1);
	}).catch(err => {
		console.log('find conver', err) && cb(-1) ;
	});
}

module.exports.seenMessage = (req, res) => {
	NewMessage.destroy({
		where: {
			idUser: req.body.idUser,
			nameConversation: req.body.nameConversation
		}
	}).then(rs => {
		res.send(response(200, 'SUCCESSFULLY'));
	}).catch(err => {
		res.send(response(400, 'SOMETHING WENT WRONG: '+ err));
	});
}