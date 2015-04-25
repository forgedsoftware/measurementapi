
var m = require('measurejs'),
	h = require('./helpers');

exports.summary = function (req, res) {
	// As json/xml??
	res.send('Find can be used to discover types of dimensions, systems, prefixes, and units.');
};

// TODO: options: include rare, include historical etc

exports.findDimension = function (req, res) {
	var result = h.getResults(req, res, 'dimension was', function (search) {
		return m.findDimensionPartial(search);
	});
	if (result) {
		h.sendResponse(req, res, result._config, 'dimension'); // TODO - serialize this, include key
	}
};

exports.findDimensions = function (req, res) {
	var results = h.getResults(req, res, 'dimensions were', function (search) {
		return m.findDimensionsPartial(search);
	});
	h.sendKeys(req, res, results, 'dimensions');
};

exports.findBaseUnit = function (req, res) {
	var result = h.getResults(req, res, 'base unit was', function (search) {
		return m.findBaseUnitPartial(search);
	});
	if (result) {
		h.sendResponse(req, res, result._config, 'unit'); // TODO - serialize this, include key
	}
};

exports.findUnit = function (req, res) {
	var dimension = h.getDimension(req, res);
	if (dimension) {
		var result = h.getResults(req, res, 'unit was', function (search) {
			return m.findUnitPartial(search, dimension);
		});
		if (result) {
			h.sendResponse(req, res, result._config, 'unit'); // TODO - serialize this, include key
		}
	}
};

exports.findUnits = function (req, res) {
	var dimension = h.getDimension(req, res);
	if (dimension) {
		var results = h.getResults(req, res, 'units were', function (search) {
			return m.findUnitsPartial(search, dimension);
		});
		h.sendKeys(req, res, results, 'units');
	}
};

exports.findSystem = function (req, res) {
	var result = h.getResults(req, res, 'system was', function (search) {
		return m.findSystemPartial(search);
	});
	if (result) {
		h.sendResponse(req, res, result._config, 'system'); // TODO - serialize this, include key
	}
};

exports.findSystems = function (req, res) {
	var results = h.getResults(req, res, 'systems were', function (search) {
		return m.findSystemsPartial(search);
	});
	h.sendKeys(req, res, results, 'systems');
};

exports.findPrefix = function (req, res) {
	var result = h.getResults(req, res, 'prefix was', function (search) {
		return m.findPrefixPartial(search);
	});
	if (result) {
		h.sendResponse(req, res, result._config, 'prefix'); // TODO - serialize this, include key
	}
};

exports.findPrefixes = function (req, res) {
	var results = h.getResults(req, res, 'prefixes were', function (search) {
		return m.findPrefixesPartial(search);
	});
	h.sendKeys(req, res, results, 'prefixes');
};
