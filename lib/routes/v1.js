
// Version 1 - Routing
// Changes:
// 		None

var express = require('express');
var app = module.exports = express();
var find = require('../find');
var convert = require('../convert');
var discover = require('../discover');

// DISCOVER

app.get('/dimensions', discover.dimensions);
app.get('/units/:dimensionKey', discover.units);
app.get('/systems', discover.systems);
app.get('/prefixes', discover.prefixes);

app.get('/dimension/:dimensionKey', discover.dimension);
app.get('/baseUnit/:dimensionKey', discover.baseUnit);
app.get('/unit/:dimensionKey/:unitKey', discover.unit);
app.get('/system/:systemKey', discover.system);
app.get('/prefix/:prefixKey', discover.prefix);

// FIND

app.get('/find', find.summary);

app.get('/find/dimension/:search', find.findDimension);
app.get('/dimensions/:search', find.findDimensions);

app.get('/baseUnit/:search', find.findBaseUnit); // Note: /find/baseUnits/:search does not exist as it doesn't make much sense

app.get('/unit/:dimensionKey/:search', find.findUnit);
app.get('/units/:dimensionKey/:search', find.findUnits);

app.get('/system/:search', find.findSystem);
app.get('/systems/:search', find.findSystems);

app.get('/prefix/:search', find.findPrefix);
app.get('/prefixes/:search', find.findPrefixes);

// CONVERT

app.use('/convert', convert);
