var fs = require('fs');
var git = require('./git.js');
var casper = require('./casper.js');

var userInfoFileName = process.argv[2];
var userInfo = new Object();
var solvedProblemInfo = new Array();

if (userInfoFileName != undefined) {
	fs.exists(userInfoFileName, function(exists) {
		if (!exists) {
			console.log('file not found');
			process.exit();	
		} else {
			fs.readFile(userInfoFileName, function(error, data) {
				if (error)
					process.exit();

				userInfo = JSON.parse(data);
			});
		}
	});
} else {
	console.log('node app.js [info.json]');
	process.exit();
}
