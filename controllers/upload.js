var fs = require('fs');
var jsonResponse = require('./response');
var PATH = require('path');
var directoryExists = require('directory-exists');

var configPath = require('config').get('app');
let env = process.env;

// const URL = 'http://54.169.149.206:5001';

module.exports.upload = (req, res) => {
    let folderUpload = PATH.join(__dirname, '../' + (env.UPLOAD_DIR || configPath.upload_dir) + '/' + req.body.name);
    directoryExists(folderUpload, (error, result) => {
        if (!result) {
            fs.mkdir(folderUpload, function (err) {
                console.log(fs.whoami);
                if (err) {
                    res.send(jsonResponse(400, 'CREATE FOLDER FAIL: ' + err));
                } else {
                    console.log('******MKDIR UPLOAD SUCCESS********');
                    let file = req.files.file;
                    let fileName = Date.now() + file.name;
                    let path = PATH.join(__dirname, '../' + (env.UPLOAD_DIR || configPath.upload_dir) + '/' + req.body.name + '/' + fileName);
                    fs.copyFile(file.path, path, (err) => {
                        if (err) {
                            res.send(jsonResponse(400, 'UPLOAD FAIL: ' + err));
                        }
                        else {
                            console.log('****UPLOAD SUCCESS****');
                            res.send(jsonResponse(200, 'SUCCESSFULLY', (env.URL || configPath.URL) + '/' + req.body.name + '/' + fileName));
                        }
                    });
                }
            });
        } else {
            let file = req.files.file;
            let fileName = Date.now() + file.name;
            let path = PATH.join(__dirname, '../' + (env.UPLOAD_DIR || configPath.upload_dir) + '/' + req.body.name + '/' + fileName);
            fs.copyFile(file.path, path, (err) => {
                console.log(err);
                if (err) {
                    res.send(jsonResponse(400, 'UPLOAD FAIL: ' + err));
                }
                else {
                    console.log('****UPLOAD SUCCESS****');
                    res.send(jsonResponse(200, 'SUCCESSFULLY', (env.URL || configPath.URL) + '/' + req.body.name + '/' + fileName));
                }
            });
        }
    });
};
