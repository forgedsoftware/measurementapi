
var m = require('measurejs'),
	toXml = require('js2xmlparser');

exports.getDimension = function (req, res) {
	return getEntity(req, res, 'dimensionKey', 'dimension', function (key) {
		return m.dimensions[key];
	});
}

exports.getUnit = function (dimension, req, res) {
	return getEntity(req, res, 'unitKey', 'unit', function (key) {
		return dimension.units[key];
	});
}

exports.getSystem = function (req, res) {
	return getEntity(req, res, 'systemKey', 'system', function (key) {
		return m.allSystems[key];
	});
}

exports.getPrefix = function (req, res) {
	return getEntity(req, res, 'prefixKey', 'prefix', function (key) {
		return m.prefixes[key];
	});
}

var getEntity = exports.getEntity = function (req, res, paramName, paramType, getFunc) {
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

exports.getResults = function (req, res, resultType, findFunc) {
	var search = req.params.search;
	if (!search || search.length < 1) {
		res.status(400).send({ error: 'A search phrase must be provided'});
		return null;
	}
	var result = findFunc(search);
	if (!result || result.length == 0) {
		res.status(404).send({ error: 'No ' + resultType + ' found with the provided search phrase'});
		return null;
	}
	return result;
}

exports.sendKeys = function (req, res, resultArr, rootType) {
	if (resultArr) {
		var keyArr = [];
		resultArr.forEach(function (result) {
			keyArr.push(result.key);
		})
		sendResponse(req, res, keyArr, rootType);
	}
}

var sendResponse = exports.sendResponse = function (req, res, obj, rootType) {
	switch (req.accepts(['json', 'text/xml', 'application/xml'])) {
		case 'json':
			res.set('Content-Type', 'application/json');
			res.send(obj);
			break;
		case 'text/xml':
		case 'application/xml':
			res.set('Content-Type', 'application/xml');
			var options = {
				arrayMap: {
					otherNames: 'name',
					units: 'unit',
					dimensions: 'dimension',
					systems: 'system',
					otherSymbols: 'symbol',
					otherNames: 'name',
					prefixes: 'prefix',
					children: 'child'
				}
			};
			res.send(toXml(rootType, obj, options));
			break;
		default:
			res.status(406).send('Error: Specified accept type is not supported.');
			break;
	}
}
