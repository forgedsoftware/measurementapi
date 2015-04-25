
// Version 1 - Routing
// Changes:
// 		None

var express = require('express'),
	app = module.exports = express(),
	find = require('../find'),
	convert = require('../convert'),
	discover = require('../discover');

var version = module.exports.version = {
	name: 'Version 1',
	path: '/v1',
	accept: ['application/vnd.measurement.v1+json', 'application/vnd.measurement.v1+xml']
};

app.use(function (req, res, next) {
	res.set('Server', 'Measurement' + version.path);
	next();
});

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
app.get('/find/dimensions/:search', find.findDimensions);

app.get('/find/baseUnit/:search', find.findBaseUnit); // Note: /find/baseUnits/:search does not exist as it doesn't make much sense

app.get('/find/unit/:dimensionKey/:search', find.findUnit);
app.get('/find/units/:dimensionKey/:search', find.findUnits);

app.get('/find/system/:search', find.findSystem);
app.get('/find/systems/:search', find.findSystems);

app.get('/find/prefix/:search', find.findPrefix);
app.get('/find/prefixes/:search', find.findPrefixes);

// CONVERT

app.use('/convert', convert);
