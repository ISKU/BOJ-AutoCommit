var casper = require('casper').create({verbose: true});
var id = casper.cli.args[0];
var password = casper.cli.args[1];
var sourceNumber = casper.cli.args[2];

casper.start('https://www.acmicpc.net/login');

casper.then(function() {
	casper.fill('form.reg-page', {
		'login_user_id': id,
		'login_password': password
	}, true);
});

casper.thenOpen('https://www.acmicpc.net/source/' + sourceNumber, function() {
	casper.then(function() {
		var sourceInfo = casper.evaluate(function() {
			return {
				source: document.querySelector('#source').value,
				problemNumber: __utils__.findOne('.table-striped tr td:nth-child(3) a').innerHTML,
				problemTitle: __utils__.findOne('.table-striped tr td:nth-child(4)').innerHTML,
				language: __utils__.findOne('.table-striped tr td:nth-child(8)').innerHTML,
				private: document.querySelector('#code_open_close').checked
			}
		});

		casper.echo(JSON.stringify(sourceInfo, null, 4));
	});
});

casper.run(function() {
	casper.exit();
});
