
var m = require('measurejs'),
	h = require('./helpers');

// Discover - Sets of Values

exports.dimensions = function (req, res) {
	h.sendResponse(req, res, Object.keys(m.dimensions), 'dimensions', 'dimension');
};

exports.units = function (req, res) {
	var dimension = h.getDimension(req, res);
	if (dimension) {
		h.sendResponse(req, res, Object.keys(dimension.units), 'units', 'unit');
	}
};

exports.systems = function (req, res) {
	h.sendResponse(req, res, Object.keys(m.allSystems), 'systems', 'system');
};

exports.prefixes = function (req, res) {
	h.sendResponse(req, res, Object.keys(m.prefixes), 'prefixes', 'prefix');
};

// Discover - Entities

exports.dimension = function (req, res) {
	// TODO: option: verbose - includes all unit information as well
	var dimension = h.getDimension(req, res);
	if (dimension) {
		h.sendResponse(req, res, dimension._config, 'dimension'); // TODO - serialize this, include key
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
		h.sendResponse(req, res, baseUnit._config, 'unit'); // TODO - serialize this, include key and dimension key
	}
};

exports.unit = function (req, res) {
	var dimension = h.getDimension(req, res);
	if (dimension) {
		var unit = h.getUnit(dimension, req, res);
		if (unit) {
			h.sendResponse(req, res, unit._config, 'unit');
		}
	}
};

exports.system = function (req, res) {
	var system = h.getSystem(req, res);
	if (system) {
		h.sendResponse(req, res, system._config, 'system'); // TODO - serialize this, include key
	}
};

exports.prefix = function (req, res) {
	var prefix = h.getPrefix(req, res);
	if (prefix) {
		h.sendResponse(req, res, prefix._config, 'prefix'); // TODO - serialize this, include key
	}
};
