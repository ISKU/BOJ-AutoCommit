exports.commitMessage = function(info, userInfo) {
	if (userInfo.hasOwnProperty('commitMessage'))
		return userInfo.commitMessage.replace(/\[NO\]/gi, info.problemNumber);

	return 'https://www.acmicpc.net/problem/' + info.problemNumber;
}

exports.sourceTree = function(problemNumber, userInfo) {
	if (userInfo.hasOwnProperty('sourceTree')) {
		if (userInfo.sourceTree.endsWith('/')) {
			var sourceTree = userInfo.sourceTree.slice(0, userInfo.sourceTree.length - 1);
			return sourceTree.replace(/\[NO\]/gi, problemNumber);
		}
		
		return userInfo.sourceTree.replace(/\[NO\]/gi, problemNumber);
	}

	return userInfo.repo;
}

exports.dirName = function(problemNumber, userInfo) {
	if (userInfo.hasOwnProperty('dirName'))
		return (userInfo.dirName.replace(/\[NO\]/gi, problemNumber)) + '/';

	return problemNumber + '/';
}

exports.mkdir = function(problemNumber, userInfo) {
	if (userInfo.hasOwnProperty('mkdir')) {
		if (userInfo.mkdir)
			return exports.dirName(problemNumber, userInfo);
		else
			return '';
	}

	return exports.dirName(problemNumber, userInfo);
}

exports.private = function(info, userInfo) {
	if (userInfo.hasOwnProperty('private'))
		if (userInfo.private && info.private)
			return false;

	return true;
}

exports.poll = function(userInfo) {
	if (userInfo.hasOwnProperty('poll'))
		return userInfo.poll;

	return 600000;
}

exports.sourceName = function(problemNumber, language, userInfo) {
	if (userInfo.hasOwnProperty('sourceName'))
		return (userInfo.sourceName.replace(/\[NO\]/gi, problemNumber)) + '.' + language;

	return problemNumber + '.' + language;
}
