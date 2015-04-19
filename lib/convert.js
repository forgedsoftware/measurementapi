
var express = require('express');
//var find = require('../find');
var app = module.exports = express();
var m = require('measurejs');

app.get('/', function (req, res) {
	res.send('Convert converts an amount between two units in the same dimension');
});

app.get('/:amount/:dimension/:from/:to', function (req, res) {
	// TODO
});

app.get('/:amount/:from/:to', function (req, res) {
	// TODO
});
