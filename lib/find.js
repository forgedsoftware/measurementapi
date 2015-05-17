
var m = require('measurejs'),
	h = require('./helpers'),
	url = require('url');

// TODO: options: include rare, include historical etc

exports.findDimension = function (req, res) {
	var result = h.getResults(req, res, 'dimension was', function (search) {
		return m.findDimensionPartial(search);
	});
	if (result) {
		var isVerbose = (url.parse(req.url, true).query.isVerbose == 'true');
		h.sendResponse(req, res, result.serialize(isVerbose), 'dimension');
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
		h.sendResponse(req, res, result.serialize(), 'unit');
	}
};

exports.findUnit = function (req, res) {
	var dimension = h.getDimension(req, res);
	if (dimension) {
		var result = h.getResults(req, res, 'unit was', function (search) {
			return m.findUnitPartial(search, dimension);
		});
		if (result) {
			h.sendResponse(req, res, result.serialize(), 'unit');
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
		h.sendResponse(req, res, result.serialize(), 'system');
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
		h.sendResponse(req, res, result.serialize(), 'prefix');
	}
};

exports.findPrefixes = function (req, res) {
	var results = h.getResults(req, res, 'prefixes were', function (search) {
		return m.findPrefixesPartial(search);
	});
	h.sendKeys(req, res, results, 'prefixes');
};
