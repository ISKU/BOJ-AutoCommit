exports.commitMessage = function(info, userInfo) {
	if (userInfo.hasOwnProperty('commitMessage'))
		return userInfo.commitMessage.replace(/\[NO\]/gi, info.problemNumber);
	return 'https://www.acmicpc.net/problem/' + info.problemNumber;
}

exports.poll = function(userInfo) {
	if (userInfo.hasOwnProperty('poll'))
		return userInfo.poll;
	return 600000;
}
