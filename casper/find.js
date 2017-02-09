var casper = require('casper').create({verbose: true});
var id = casper.cli.args[0];

casper.start('https://www.acmicpc.net/status/?user_id=' + id + '&language_id=-1&result_id=4', function() {
	casper.then(function() {
		var table = casper.evaluate(function() {
			return {
				sourceNumber:
					[].map.call(__utils__.findAll('#status-table tr td:nth-child(1)'), function(element) {
						return element.innerHTML;
					}),

				problemNumber:
					[].map.call(__utils__.findAll('#status-table tr td:nth-child(3) a'), function(element) {
						return element.innerHTML;
					}),

				language:
					[].map.call(__utils__.findAll('#status-table tr td:nth-child(7)'), function(element) {
						return element.innerHTML.replace(/ |\t|\n/gi, '');
					})
			}
		});

		casper.echo(JSON.stringify(table, null, 4));
	});
});

casper.run(function() {
	casper.exit();
});
