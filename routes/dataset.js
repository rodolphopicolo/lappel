var express = require('express');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

var router = express.Router();

 var fs = require('fs')

// var DATASET_DIR = '/mnt/sda6-home-sda5/rodolpho/dev/mine/projeto-aplicado/dataset';
// var DATASET_DIR = '/home/rodolpho/dev/mine/lappel/dataset';
var DATASET_DIR = path.join(__dirname, '../../dataset-fake');

console.log("DATASET DIR: " + DATASET_DIR);

router.get('/', function(req, res, next) {
	fs.readdir(DATASET_DIR, function(error, files){
		res.send(files);
	});  
});

router.get('/sample', function(req, res, next) {
	console.log(req.url);
	var q = url.parse(req.url);
	var search = q.search.substring(1);
	var values = querystring.parse(search);

	var fileName = values.name;

	filePath = path.join(DATASET_DIR, fileName);

	res.writeHead(200, {'Content-Type': 'image/jpg'});

	var readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
});

router.get('/mark', function(req, res, next) {
	var q = url.parse(req.url);
	var search = q.search.substring(1);
	var values = querystring.parse(search);

	var originalFileName = values.name;
	if(originalFileName == null){
		return;
	}
	console.log('Original file name: ' + originalFileName);
	var fileName = originalFileName + '.json';

	filePath = path.join(DATASET_DIR, fileName);

	try {
		fs.accessSync(filePath, fs.constants.F_OK, fs.constants.R_OK);
	} catch(err){
		var content = '{"name":"' + values.name + '", "classes":["label"], "regions":[]}';
		fs.writeFileSync(filePath, content, {'encoding':'utf8', 'flag':'wx+'});
	}

	res.writeHead(200, {'Content-Type': 'application/json'});
	var readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
});

module.exports = router;
