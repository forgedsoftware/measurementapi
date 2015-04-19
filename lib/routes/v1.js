
// Version 1 - Routing
// Changes:
// 		None

var express = require('express');
var app = module.exports = express();
var find = require('../find');
var convert = require('../convert');
var discover = require('../discover');

// DISCOVER

app.use('/dimensions', discover.dimensions);
app.get('/units/:dimensionKey', discover.units);
app.get('/systems', discover.systems);
app.get('/prefixes', discover.prefixes);

app.get('/dimension/:dimensionKey', discover.dimension);
app.get('/baseUnit/:dimensionKey', discover.baseUnit);
app.get('/unit/:dimensionKey/:unitKey', discover.unit);
app.get('/system/:systemKey', discover.system);
app.get('/prefix/:prefixKey', discover.prefix);

// FIND

app.use('/find', find);

// CONVERT

app.use('/convert', convert);
