
var express = require('express'),
	app = module.exports = express(),
	m = require('measurejs');

app.get('/:amount/:dimension/:from/:to', function (req, res) {
	// TODO
	res.status(501).send({ error: 'This endpoint has not been implemented'});
});

app.get('/:amount/:from/:to', function (req, res) {
	// TODO
	res.status(501).send({ error: 'This endpoint has not been implemented'});
});

app.get('/:from/:to', function (req, res) {
	// TODO - Assume amount = 1
	res.status(501).send({ error: 'This endpoint has not been implemented'});
});
