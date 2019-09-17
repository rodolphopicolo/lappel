var express = require('express');
var url = require('url');
var querystring = require('querystring');
var path = require('path');

var router = express.Router();

 var fs = require('fs')

// var DATASET_DIR = '/mnt/sda6-home-sda5/rodolpho/dev/mine/projeto-aplicado/dataset';
var DATASET_DIR = '/home/rodolpho/dev/mine/lappel/dataset';

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

module.exports = router;
