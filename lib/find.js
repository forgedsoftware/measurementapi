
var express = require('express');
//var find = require('../find');
var app = module.exports = express();
var m = require('measurejs');

app.get('/', function (req, res) {
	res.send('Find can be used to discover types of dimensions, systems, prefixes, and units.');
});

// TODO: options: include rare, include historical etc

app.get('/dimension/:search', function (req, res) {
	var result = getResults(req, res, 'dimension was', function (search) {
		return m.findDimensionPartial(search);
	});
	if (result) {
		res.send(result._config); // TODO - serialize this, include key
	}
});

app.get('/dimensions/:search', function (req, res) {
	var results = getResults(req, res, 'dimensions were', function (search) {
		return m.findDimensionsPartial(search);
	});
	sendKeys(res, results);
});

// Note: /find/baseUnits/:search does not exist as it doesn't make much sense
app.get('/baseUnit/:search', function (req, res) {
	var result = getResults(req, res, 'base unit was', function (search) {
		return m.findBaseUnitPartial(search);
	});
	if (result) {
		res.send(result._config); // TODO - serialize this, include key
	}
});

app.get('/unit/:dimensionKey/:search', function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		var result = getResults(req, res, 'unit was', function (search) {
			return m.findUnitPartial(search, dimension);
		});
		if (result) {
			res.send(result._config); // TODO - serialize this, include key
		}
	}
});

app.get('/units/:dimensionKey/:search', function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		var results = getResults(req, res, 'units were', function (search) {
			return m.findUnitsPartial(search, dimension);
		});
		sendKeys(res, results);
	}
});

app.get('/system/:search', function (req, res) {
	var result = getResults(req, res, 'system was', function (search) {
		return m.findSystemPartial(search);
	});
	if (result) {
		res.send(result._config); // TODO - serialize this, include key
	}
});

app.get('/systems/:search', function (req, res) {
	var results = getResults(req, res, 'systems were', function (search) {
		return m.findSystemsPartial(search);
	});
	sendKeys(res, results);
});

app.get('/prefix/:search', function (req, res) {
	var result = getResults(req, res, 'prefix was', function (search) {
		return m.findPrefixPartial(search);
	});
	if (result) {
		res.send(result._config); // TODO - serialize this, include key
	}
});

app.get('/prefixes/:search', function (req, res) {
	var results = getResults(req, res, 'prefixes were', function (search) {
		return m.findPrefixesPartial(search);
	});
	sendKeys(res, results);
});

function getResults(req, res, resultType, findFunc) {
	var search = req.params.search;
	if (!search || search.length < 1) {
		res.status(400).send({ error: 'A search phrase must be provided'});
		return null;
	}
	var result = findFunc(search);
	if (!result || result.length == 0) {
		res.status(404).send({ error: 'No ' + resultErr + ' found with the provided search phrase'});
		return null;
	}
	return result;
}

function sendKeys(res, resultArr) {
	if (resultArr) {
		var keyArr = [];
		resultArr.forEach(function (result) {
			keyArr.push(result.key);
		})
		res.send(keyArr);
	}
}