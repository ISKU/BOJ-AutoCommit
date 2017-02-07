var command = (process.platform === 'win32') ? 'casperjs.cmd' : 'casperjs';

exports.find = function(args, successFind) {
	var spawn = require('child_process').spawn(command, args);
	var info = new Object();

	spawn.stdout.on('data', function(data) {
		info = JSON.parse(data);
	});

	spawn.stderr.on('data', function(data) {
		console.log(JSON.stringify(data));
	});

	spawn.on('exit', function(code) {
		successFind(info);
	});
}

exports.download = function(args, successDownload) {
	var spawn = require('child_process').spawn(command, args);
	var info = new Object();

	spawn.stdout.on('data', function(data) {
		info = JSON.parse(data);
	});

	spawn.stderr.on('data', function(data) {
		console.log(JSON.stringify(data));
	});

	spawn.on('exit', function(code) {
		successDownload(info);
	});
}
