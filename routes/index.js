const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty({
    maxFilesSize: 50*1024*1024
});
var express = require('express');
var router = express.Router();
var PATH = require('path');
var ctrlMessage = require('../controllers/message');
var ctrlConversation = require('../controllers/conversation');
var ctrlUser = require('../controllers/user');

var ctrlUpload = require('../controllers/upload.js');
var ctrlThumb = require('../controllers/thumb.js');
var ctrlImageOrigin = require('../controllers/imageOrigin.js');
var ctrlSocket = require('../controllers/socket.js');

const auth = require('../controllers/authenticate');

router.use(auth());

//user
router.post('/user', (req, res) => {
	ctrlUser.getUser(req,res);
});
//list user from wi-server
router.post('/user/list', (req, res) => {
	ctrlUser.getListUser(req, res);
});
//list company from wi-server
router.post('/company/list', (req, res) => {
	ctrlUser.getListCompany(req, res);
})
//message
router.post('/message/new', (req,res) => {
	ctrlMessage.postMessage(req,res);
});
//seen message
router.post('/message/seen', (req,res) => {
	ctrlMessage.seenMessage(req,res);
});
//Conversation
router.post('/conversation', (req, res) => {
	ctrlConversation.getConversation(req, res);
});
//List conversation
router.post('/conversation/list/admin', (req, res) => {
	ctrlConversation.getListConversation(req, res);
})
router.post('/conversation/update', (req, res) => {
	ctrlConversation.updateConversation(req, res);
})
router.post('/conversation/getDisableNoti', (req, res) => {
	ctrlConversation.getDisableNoti(req, res);
})
//upload
router.post('/upload', multipartyMiddleware, (req, res) => {
    ctrlUpload.upload(req,res);
})
//download
router.get('/download/:folder/:fileName', (req, res) => {
	// res.download(PATH.join(__dirname, '../database/upload/' + req.params.folder + '/' + req.params.fileName), req.params.fileName.substr(33, req.params.fileName.length));
	res.download(PATH.join(__dirname, '../' + (process.env.UPLOAD_DIR || configPath.upload_dir) + '/'+req.params.folder+'/'+req.params.fileName), req.params.fileName.substr(33, req.params.fileName.length));
});
router.get('/imageOrigin/:folder/:fileName', (req, res) => {
    ctrlImageOrigin.getImageOrigin(req, res);
});
//thumb image
router.get('/thumb/:folder/:fileName', (req, res) => {
    ctrlThumb.thumb(req, res);
});
//monitor socket
router.get('/monitor', (req, res) => {
	ctrlSocket.getMonitor(req, res);
})
module.exports = router;
