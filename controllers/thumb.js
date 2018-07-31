var response = require('./response');
var thumb = require('node-thumbnail').thumb;
var directoryExists = require('directory-exists');
var path = require('path');
var fs = require('fs');
var md5 = require('md5');
const WIDTH_IMAGE_THUMB = 200;

var configPath = require('config').get('app');

module.exports.thumb = function(req, res) {
    var original_dir = path.join(__dirname, '../' + configPath.upload_dir + '/'+req.params.folder+'/'+req.params.fileName);
    var thumb_dir = path.join(__dirname, '../' + configPath.upload_dir + '/'+ req.params.folder+ '/thumb');
    directoryExists(thumb_dir, function(err, result) {
        console.log('result', result);
        if(!result) {
            fs.mkdir(thumb_dir, function(err) {
                if(err) {
                    res.sendFile(original_dir);
                }else{
                   thumb({
                        source: original_dir,
                        destination: thumb_dir,
                        basename: md5(req.params.fileName),
                        suffix: '',
                        width: WIDTH_IMAGE_THUMB,
                        skip: true,
                        overwrite: false
                    }, function(files, err, stdout, stderr){
                        if(err || stderr) {
                            res.send(response(400, 'THUMB FAIL', err));
                        }
                        else {
                            var lastDots = req.params.fileName.lastIndexOf('.');
                            var typeFile = req.params.fileName.substring(lastDots, req.params.fileName.length);
                            var pathOutFile = path.join(thumb_dir, md5(req.params.fileName) + typeFile);
                            res.sendFile(pathOutFile);
                        }
                    });
                }
            });
        }else{
            thumb({
                source: original_dir,
                destination: thumb_dir,
                basename: md5(req.params.fileName),
                suffix: '',
                width: WIDTH_IMAGE_THUMB,
                skip: true,
                overwrite: false
            }, function(files, err, stdout, stderr){
                if(err || stderr) {
                    res.send(response(400, 'THUMB FAIL', err));
                }
                else {
                    var lastDots = req.params.fileName.lastIndexOf('.');
                    var typeFile = req.params.fileName.substring(lastDots, req.params.fileName.length);
                    var pathOutFile = path.join(thumb_dir, md5(req.params.fileName) + typeFile);
                    res.sendFile(pathOutFile);
                }
            });
        }
    });
}
