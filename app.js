#!/usr/bin/env node

var fs = require('fs');
var git = require('./git.js');
var casper = require('./casper.js');
var option = require('./option.js');

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
				if (error) {
					console.log('read file error');
					process.exit();
				}

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
	userInfo.repo = urlArray[urlArray.length - 1].split('.')[0];

	fs.exists(userInfo.repo, function(exists) {
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
			console.log('repository \'' + userInfo.repo + '\' already exists');
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
		var language = info.language[index];

		if (!solvedProblemInfo.containsProblemNumber(problemNumber)) {
			solvedProblemInfo.push({'problemNumber': problemNumber, 
						'sourceNumber': sourceNumber, 
						'language': language});

			console.log(problemNumber + ' ' + sourceNumber + ' ' + language);
		}
	}

	downloadSource();
}

function downloadSource() {
	var args = ['./casper/download.js', userInfo.boj_id, userInfo.boj_password];

	(function next(index) {
		if (index < 0) {
			idle();
			return;
		} else {
			var problemNumber = solvedProblemInfo[index].problemNumber;
			var sourceNumber = solvedProblemInfo[index].sourceNumber;
			var language = solvedProblemInfo[index].language;
			var sourceTree = option.sourceTree(problemNumber, userInfo) + '/' + option.mkdir(problemNumber, userInfo);
			var sourceName = sourceTree + option.sourceName(problemNumber, language, userInfo);

			fs.exists(sourceName, function(exists) {
				if (!exists) {
					var fullArgs = args.slice(0);
					fullArgs.push(sourceNumber);

					console.log(sourceNumber);
					casper.download(fullArgs, function(info) {
						if (info == null) {
							console.log('Failed to download source number #' + sourceNumber);
							next(index - 1);
						} else if (option.private(info, userInfo)) {
							saveSource(sourceTree, sourceName, info, function() {
								gitAll(info, function() {
									next(index - 1);
								});
							});
						} else {
							console.log('Code #' + info.problemNumber + ' is private');
							next(index - 1);
						}
					});
				} else {
					console.log(problemNumber + ' already exists');
					next(index - 1);
				}
			});
		}
	}) (solvedProblemInfo.length - 1);
}

function saveSource(sourceTree, sourceName, info, successSave) {
	fs.exists(sourceTree, function(exists) {
		if (!exists) {
			var sourceTreePath = sourceTree.split('/');

			(function next(index) {
				var currentPath = sourceTreePath[0];
				for (var i = 1; i < sourceTreePath.length && i <= index; i++)
					currentPath = currentPath + '/' + sourceTreePath[i];

				if (index > sourceTreePath.length) {
					fs.writeFile(sourceName, info.source, function(error) {
						if (error) {
							console.log('save source error');
							process.exit();
						}

						console.log('\'' + sourceName + '\' saved successfully');
						successSave();
					});

					return;
				} else {
					fs.exists(currentPath, function(exists) {
						if (exists)
							next(index + 1);	
						else {
							fs.mkdir(currentPath, function(error) {
								if (error) {
									console.log('mkdir error');
									process.exit();
								}

								next(index + 1);
							});
						}
					});
				}
			}) (0);
		} else {
			fs.writeFile(sourceName, info.source, function(error) {
				if (error) {
					console.log('save source error');
					process.exit();
				}

				console.log('\'' + sourceName + '\' saved successfully');
				successSave();
			});
		}
	});
}

function gitAll(info, successAll) {
	var sourceTree = option.sourceTree(info.problemNumber, userInfo) + '/' + option.mkdir(info.problemNumber, userInfo);
	var sourceName = sourceTree + option.sourceName(info.problemNumber, info.language, userInfo);
	var commitMessage = option.commitMessage(info, userInfo);
	var remoteUrl = 'https://' + userInfo.git_id + ':' + userInfo.git_password + '@github.com/' + userInfo.git_id + '/' + userInfo.repo;

	sourceName = sourceName.replace(userInfo.repo + '/', '');
	git.all(sourceName, commitMessage, remoteUrl, userInfo.repo, function() {
		console.log('git push ' + info.problemNumber + ', succeeded');
		successAll();
	});
}

function idle() {
	var poll = option.poll(userInfo);
	solvedProblemInfo = new Array();

	console.log('Wait ' + poll + ' milliseconds...');	
	setTimeout(function() {
		console.log('start working');
		findSolvedProblem();
	}, poll);
}

Array.prototype.containsProblemNumber = function(element) {
	for (var index = 0; index < this.length; index++)
		if (this[index].problemNumber == element)
			return true;
	return false;
}
