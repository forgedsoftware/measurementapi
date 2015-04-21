
var m = require('measurejs');
var toXml = require("js2xmlparser");

exports.summary = function (req, res) {
	// As json/xml??
	res.send('Find can be used to discover types of dimensions, systems, prefixes, and units.');
};

// TODO: options: include rare, include historical etc

exports.findDimension = function (req, res) {
	var result = getResults(req, res, 'dimension was', function (search) {
		return m.findDimensionPartial(search);
	});
	if (result) {
		sendResponse(req, res, result._config); // TODO - serialize this, include key
	}
};

exports.findDimensions = function (req, res) {
	var results = getResults(req, res, 'dimensions were', function (search) {
		return m.findDimensionsPartial(search);
	});
	sendKeys(req, res, results);
};

exports.findBaseUnit = function (req, res) {
	var result = getResults(req, res, 'base unit was', function (search) {
		return m.findBaseUnitPartial(search);
	});
	if (result) {
		sendResponse(req, res, result._config); // TODO - serialize this, include key
	}
};

exports.findUnit = function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		var result = getResults(req, res, 'unit was', function (search) {
			return m.findUnitPartial(search, dimension);
		});
		if (result) {
			sendResponse(req, res, result._config); // TODO - serialize this, include key
		}
	}
};

exports.findUnits = function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		var results = getResults(req, res, 'units were', function (search) {
			return m.findUnitsPartial(search, dimension);
		});
		sendKeys(req, res, results);
	}
};

exports.findSystem = function (req, res) {
	var result = getResults(req, res, 'system was', function (search) {
		return m.findSystemPartial(search);
	});
	if (result) {
		sendResponse(req, res, result._config); // TODO - serialize this, include key
	}
};

exports.findSystems = function (req, res) {
	var results = getResults(req, res, 'systems were', function (search) {
		return m.findSystemsPartial(search);
	});
	sendKeys(req, res, results);
};

exports.findPrefix = function (req, res) {
	var result = getResults(req, res, 'prefix was', function (search) {
		return m.findPrefixPartial(search);
	});
	if (result) {
		sendResponse(req, res, result._config); // TODO - serialize this, include key
	}
};

exports.findPrefixes = function (req, res) {
	var results = getResults(req, res, 'prefixes were', function (search) {
		return m.findPrefixesPartial(search);
	});
	sendKeys(req, res, results);
};

// HELPER FUNCTIONS

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

function sendKeys(req, res, resultArr) {
	if (resultArr) {
		var keyArr = [];
		resultArr.forEach(function (result) {
			keyArr.push(result.key);
		})
		sendResponse(req, res, keyArr);
	}
}

function sendResponse(req, res, obj) {
	if (req.accepts('application/json')) {
		res.set('Content-Type', 'application/json');
		res.send(obj); // TODO - serialize this, include key and dimension key
	} else if (req.accepts('text/xml') || req.accepts('application/xml')) {
		res.set('Content-Type', 'application/xml');
		res.send(toXml('unit', obj));
	} else {
		res.status(406).send('Error: Specified accept type is not supported.');
	}
}
