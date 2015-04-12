
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router(); 

app.get('/', function (req, res) {
  res.send('Measurement API provides functionality for unit conversion and manipulating dimensions.');
});

// Find

app.get('/find', function (req, res) {
	res.send('Find can be used to discover types of dimensions, systems, prefixes, and units.');
});

app.get('/find/:type/:search', function (req, res) {
	// type: dimension, unit, system, prefix, baseUnit
	// options: include rare, include historical etc
	// TODO
});

// Discover - By Type

app.get('/dimension', function (req, res) {
	// TODO - Keys of all dimensions
});

app.get('/unit/:dimensionKey', function (req, res) {
	// TODO - Keys of all units in dimension
});

app.get('/system', function (req, res) {
	// TODO - Keys of all systems
});

app.get('/prefix', function (req, res) {
	// TODO - Keys of all prefixes
});

// Discover - By Key

app.get('/dimension/:dimensionKey', function (req, res) {
	// option: verbose - includes all unit information as well
	// TODO
});

app.get('/baseUnit/:dimensionKey', function (req, res) {
	// TODO
});

app.get('/unit/:dimensionKey/:unitKey', function (req, res) {
	// TODO
});

app.get('/system/:systemKey', function (req, res) {
	// TODO
});

app.get('/prefix/:prefixKey', function (req, res) {
	// TODO
});

// Convert - Simple

app.get('/convert/:amount/:dimension/:from/:to', function (req, res) {
	// TODO
});

app.get('/convert/:amount/:from/:to', function (req, res) {
	// TODO
});

app.listen(port);
console.log('Measurement API Service started on port ' + port);
