exports.poll = function(userInfo) {
	if (userInfo.hasOwnProperty('poll'))
		return userInfo.poll;
	return 600000;
}
