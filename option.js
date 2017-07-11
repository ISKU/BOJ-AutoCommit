exports.commitMessage = function(info, userInfo) {
	if (userInfo.hasOwnProperty('commitMessage'))
		return replaceAll(userInfo.commitMessage, info.problemNumber, info.problemTitle);

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
		return (userInfo.sourceName.replace(/\[NO\]/gi, problemNumber)) + getExt(language);

	return problemNumber + getExt(language);
}

function replaceNumber(value, problemNumber) {
	return value.replace(/\[NO\]/gi, problemNumber);
}

function replaceAll(value, problemNumber, problemTitle) {
	return value.replace(/\[NO\]/gi, problemNumber)).replace(/\[TITLE\]/gi, problemTitle));
}

function getExt(language) {
	switch (language) {
		case 'C': return '.c';
		case 'C++': return '.cc';
		case 'C++11': return '.cc';
		case 'C++14': return '.cc';
		case 'Java': return '.java';
		case 'C11': return '.c';
		case 'Python': return '.py';
		case 'Python3': return '.py';
		case 'PyPy': return '.py';
		case 'PyPy3': return '.py';
		case 'Ruby2.2': return '.rb';
		case 'C#4.0': return '.cs';
		case 'Text': return '.txt';
		case 'Go': return '.go';
		case 'F#': return '.fs';
		case 'Pascal': return '.pas';
		case 'Lua': return '.lua';
		case 'Perl': return '.pl';
		case 'C(Clang)': return '.c';
		case 'C++11(Clang)': return '.cc';
		case 'C++14(Clang)': return '.cc';
		case 'Fortran': return '.f95';
		case 'Scheme': return '.scm';
		case 'Ada': return '.ada';
		case 'awk': return '.awk';
		case 'OCaml': return '.ml';
		case 'Brainfuck': return '.bf';
		case 'Whitespace': return '.ws';
		case 'Tcl': return '.tcl';
		case 'Assembly(32bit)': return '.asm';
		case 'D': return '.d';
		case 'Clojure': return '.clj';
		case 'Rhino': return '.js';
		case 'Cobol': return '.cob';
		case 'SpiderMonkey': return '.js';
		case 'Pike': return '.pike';
		case 'sed': return '.sed';
		case 'Rust': return '.rs';
		case 'Intercal': return '.i';
		case 'bc': return '.bc';
		case 'VB.NET4.0': return '.vb';
		case '아희': return '.aheui';
		default: return '';
	}
}
