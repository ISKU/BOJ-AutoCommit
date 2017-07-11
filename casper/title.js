var casper = require('casper').create({verbose: true});
var problemNumber = casper.cli.args[0];

casper.start('https://www.acmicpc.net/problem/' + problemNumber, function() {
	casper.then(function() {
		var problemTitle = casper.evaluate(function() {
			return __utils__.findOne('#problem_title').innerHTML;
		});

		casper.echo(problemTitle);
	});
});

casper.run(function() {
	casper.exit();
});
