let configApp = require('config').get('app');
const PORT = process.env.CHAT_PORT || process.env.PORT || configApp.port;
const path = require('path');

let appProfile = require('./app-init');

//appProfile.app.get('/', function(req, res) {
	// res.sendFile(path.join(__dirname, '../client/index.html'));
//  res.send({content: "ok"});
//});

appProfile.server.listen(PORT, function () {
	console.log('\n============================ LISTENING ON PORT ', PORT, '================================\n');
});

