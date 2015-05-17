
var m = require('measurejs'),
	h = require('./helpers'),
	url = require('url');

// Discover - Sets of Values

exports.dimensions = function (req, res) {
	h.sendResponse(req, res, Object.keys(m.dimensions), 'dimensions');
};

exports.units = function (req, res) {
	var dimension = h.getDimension(req, res);
	if (dimension) {
		h.sendResponse(req, res, Object.keys(dimension.units), 'units');
	}
};

exports.systems = function (req, res) {
	h.sendResponse(req, res, Object.keys(m.allSystems), 'systems');
};

exports.prefixes = function (req, res) {
	h.sendResponse(req, res, Object.keys(m.prefixes), 'prefixes');
};

// Discover - Entities

exports.dimension = function (req, res) {
	var dimension = h.getDimension(req, res);
	if (dimension) {
		var isVerbose = (url.parse(req.url, true).query.isVerbose == 'true');
		h.sendResponse(req, res, dimension.serialize(isVerbose), 'dimension');
	}
};

exports.baseUnit = function (req, res) {
	var dimension = h.getDimension(req, res);
	if (dimension) {
		var baseUnit = dimension.baseUnit;
		if (!baseUnit) {
			res.status(500).send({ error: 'The requested dimension does not have a base unit'});
			return;
		}
		h.sendResponse(req, res, baseUnit.serialize(), 'unit');
	}
};

exports.unit = function (req, res) {
	var dimension = h.getDimension(req, res);
	if (dimension) {
		var unit = h.getUnit(dimension, req, res);
		if (unit) {
			h.sendResponse(req, res, unit.serialize(), 'unit');
		}
	}
};

exports.system = function (req, res) {
	var system = h.getSystem(req, res);
	if (system) {
		h.sendResponse(req, res, system.serialize(), 'system');
	}
};

exports.prefix = function (req, res) {
	var prefix = h.getPrefix(req, res);
	if (prefix) {
		h.sendResponse(req, res, prefix.serialize(), 'prefix');
	}
};
