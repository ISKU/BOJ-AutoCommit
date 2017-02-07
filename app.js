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
				initClone();
			});
		}
	});
} else {
	console.log('node app.js [info.json]');
	process.exit();
}

function initClone() {
	var urlArray = userInfo.remoteUrl.split('/');
	var repo = urlArray[urlArray.length - 1].split('.');

	fs.exists(repo[0], function(exists) {
		if (!exists) {
			git.clone(userInfo.remoteUrl, function(error, stdout, stderr) {
				console.log(stdout);
				console.log(stderr);
				if (error) {
					console.log('git clone error');
					process.exit();
				}

				findSolvedProblem();
			});
		} else {
			console.log('destination path \'' + repo[0] + '\' already exists');
			findSolvedProblem();
		}
	});
}

function findSolvedProblem() {
	var args = ['./casper/find.js', userInfo.boj_id];

	casper.find(args, function(info) {
		console.log(info);
		analyzeSolvedProblem(info);
	});
}

function analyzeSolvedProblem(info) {
	for (var index = 0; index < info.problemNumber.length; index++) {
		var problemNumber = info.problemNumber[index];
		var sourceNumber = info.sourceNumber[index];

		if (!solvedProblemInfo.containsProblemNumber(problemNumber)) {
			solvedProblemInfo.push({'problemNumber': problemNumber, 'sourceNumber': sourceNumber});
			console.log(problemNumber + ' ' + sourceNumber);
		}
	}

	downloadSource();
}

function downloadSource() {
	var args = ['./casper/download.js', userInfo.boj_id, userInfo.boj_password];

	(function next(index) {
		if (index < 0) {
			return;
		} else {
			var fullArgs = args.slice(0);
			fullArgs.push(solvedProblemInfo[index].sourceNumber);
			console.log(solvedProblemInfo[index].sourceNumber);

			casper.download(fullArgs, function(info) {
				next(index - 1);
			});
		}
	}) (solvedProblemInfo.length - 1);
}

Array.prototype.containsProblemNumber = function(element) {
	for (var index = 0; index < this.length; index++)
		if (this[index].problemNumber == element)
			return true;
	return false;
}
