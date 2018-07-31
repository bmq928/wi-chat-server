var response = require('./response');
var directoryExists = require('directory-exists');
var path = require('path');
var fs = require('fs');
const WIDTH_IMAGE_THUMB = 200;

var configPath = require('config').get('app');

module.exports.getImageOrigin = function(req, res) {
    var original_dir = path.join(__dirname, '../' + configPath.upload_dir + '/'+req.params.folder+'/'+req.params.fileName);
    res.sendFile(original_dir);
}
