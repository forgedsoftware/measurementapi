
var m = require('measurejs');
var toXml = require("js2xmlparser");

// Discover - Sets of Values

exports.dimensions = function (req, res) {
	res.send(Object.keys(m.dimensions));
};

exports.units = function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		res.send(Object.keys(dimension.units));
	}
};

exports.systems = function (req, res) {
	res.send(Object.keys(m.allSystems));
};

exports.prefixes = function (req, res) {
	res.send(Object.keys(m.prefixes));
};

// Discover - Entities

exports.dimension = function (req, res) {
	// TODO: option: verbose - includes all unit information as well
	var dimension = getDimension(req, res);
	if (dimension) {
		sendResponse(req, res, dimension._config); // TODO - serialize this, include key
	}
};

exports.baseUnit = function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		var baseUnit = dimension.baseUnit;
		if (!baseUnit) {
			res.status(500).send({ error: 'The requested dimension does not have a base unit'});
			return;
		}
		sendResponse(req, res, baseUnit._config); // TODO - serialize this, include key and dimension key
	}
};

exports.unit = function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		var unit = getUnit(dimension, req, res);
		if (unit) {
			sendResponse(req, res, unit._config);
			
		}
	}
};

exports.system = function (req, res) {
	var system = getSystem(req, res);
	if (system) {
		sendResponse(req, res, system._config); // TODO - serialize this, include key
	}
};

exports.prefix = function (req, res) {
	var prefix = getPrefix(req, res);
	if (prefix) {
		sendResponse(req, res, prefix._config); // TODO - serialize this, include key
	}
};

// Helpers

function getEntity(req, res, paramName, paramType, getFunc) {
	var key = req.params[paramName];
	if (!key || key.length < 1) {
		res.status(400).send({ error: 'A ' + paramType + ' key must be provided'});
		return null;
	}
	var entity = getFunc(key);
	if (!entity) {
		res.status(404).send({ error: 'The requested ' + paramType + ' could not be found'});
		return null;
	}
	return entity;
}

function getDimension(req, res) {
	return getEntity(req, res, 'dimensionKey', 'dimension', function (key) {
		return m.dimensions[key];
	});
}

function getUnit(dimension, req, res) {
	return getEntity(req, res, 'unitKey', 'unit', function (key) {
		return dimension.units[key];
	});
}

function getSystem(req, res) {
	return getEntity(req, res, 'systemKey', 'system', function (key) {
		return m.allSystems[key];
	});
}

function getPrefix(req, res) {
	return getEntity(req, res, 'prefixKey', 'prefix', function (key) {
		return m.prefixes[key];
	});
}

function sendResponse(req, res, obj) {
	if (req.accepts('application/json')) {
		res.set('Content-Type', 'application/json');
		res.send(obj); // TODO - serialize this, include key and dimension key
	} else if (req.accepts('text/xml') || req.accepts('application/xml')) {
		res.set('Content-Type', 'application/xml');
		res.send(toXml('unit', obj));
	} else {
		res.send('Error: Specified accept type is not supported.');
	}
}
