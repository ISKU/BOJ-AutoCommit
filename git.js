var exec = require('child_process').exec;

exports.clone = function(remoteUrl, successClone) {
	exec('git clone ' + remoteUrl, function(error, stdout, stderr) {
		successClone(error, stdout, stderr);
	});
}

exports.add = function(problemNumber, repoPath, successAdd) {
	exec('git add ' + problemNumber, {cwd: repoPath}, function(error, stdout, stderr) {
		successAdd(error, stdout, stderr);
	});
}

exports.commit = function(commitMessage, repoPath, successCommit) {
	exec('git commit -m "' + commitMessage + '"', {cwd: repoPath}, function(error, stdout, stderr) {
		successCommit(error, stdout, stderr);
	});
}

exports.push = function(remoteUrl, repoPath, successPush) {
	exec('git push ' + remoteUrl + ' master', {cwd: repoPath}, function(error, stdout, stderr) {
		successPush(error, stdout, stderr);
	});
}

exports.all = function(problemNumber, commitMessage, remoteUrl, repoPath, successAll) {
	exports.add(problemNumber, repoPath, function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		if (error) {
			console.log('git add error');
			process.exit();
		}

		exports.commit(commitMessage, repoPath, function(error, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
			if (error) {
				console.log('git commit error');
				process.exit();
			}

			exports.push(remoteUrl, repoPath, function(error, stdout, stderr) {
				console.log(stdout);
				console.log(stderr);
				if (error) {
					console.log('git push error');
					process.exit();
				}

				successAll();
			});
		});
	});
}
