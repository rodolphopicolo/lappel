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
// var DATASET_DIR = path.join(__dirname, '../../dataset');

console.log("DATASET DIR: " + DATASET_DIR);

router.get('/', function(req, res, next) {
	fs.readdir(DATASET_DIR, function(error, files){
		filteredFiles = files.filter((file)=>{
			var extension = file.toLowerCase().substr(file.lastIndexOf('.'));
			switch(extension){
				case '.jpg':
				case '.png':
				case '.gif':
					return true;
				default:
					return false;
			}
		});
		res.send(filteredFiles);
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

router.get('/mark', function(req, res) {
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
		var content = '{"name":"' + values.name + '", "regions":{}}';
		fs.writeFileSync(filePath, content, {'encoding':'utf8', 'flag':'wx+'});
	}

	res.writeHead(200, {'Content-Type': 'application/json'});
	var readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
});

router.get('/mark/new', function(req, res){
	var q = url.parse(req.url);
	var search = q.search.substring(1);
	var values = querystring.parse(search);
	var imageFileName = values.name;
	var points = values.points + '';

	if(!imageFileName){
		throw 'Nome de arquivo inválido';
	}
	if(!points){
		throw 'Pontos inválidos';
	}

	points = points.trim();
	while(points.indexOf(' ') >= 0){
		points = points.replace(' ', '],[');
	}
	points = '[[' + points + ']]';
	var newPoints = JSON.parse(points);
	
	var fileName = imageFileName + '.json';
	filePath = path.join(DATASET_DIR, fileName);

	var json = fs.readFileSync(filePath, {"encoding":"utf8"});
	json = JSON.parse(json);
	var regions = json['regions'];
	var keys = Object.keys(regions).sort();
	var newKey = 0;
	if(keys.length > 0){
		var lastKey = keys[keys.length - 1];
		newKey = +lastKey + 1
	}
	regions[newKey] = newPoints;
	
	var content = JSON.stringify(json);
	fs.writeFileSync(filePath, content, {'encoding':'utf8', 'flag':'w'});

	res.send(json);
});

router.get('/mark/delete', function(req, res){
	var q = url.parse(req.url);
	var search = q.search.substring(1);
	var values = querystring.parse(search);
	var imageFileName = values.name;
	var regionKey = values.region + '';

	if(!imageFileName){
		throw 'Nome de arquivo inválido';
	}
	if(!regionKey){
		throw 'Nome da região inválida';
	}

	var fileName = imageFileName + '.json';
	filePath = path.join(DATASET_DIR, fileName);

	var json = fs.readFileSync(filePath, {"encoding":"utf8"});
	json = JSON.parse(json);
	var regions = json['regions'];
	delete regions[regionKey];
	
	var content = JSON.stringify(json);
	fs.writeFileSync(filePath, content, {'encoding':'utf8', 'flag':'w'});

	res.send(json);
});

module.exports = router;
