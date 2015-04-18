
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var m = require('measurejs');
var cors = require("cors");
var models = require('./models');
var swagger = require('swagger-node-express').createNew(app);
var toXml = require("js2xmlparser");
var limiter = require('./lib/rate_limit');


var corsOptions = {
  credentials: true,
  origin: function(origin,callback) {
    if(origin===undefined) {
      callback(null,false);
    } else {
      var match = origin.match("^(.*)?.localhost(\:[0-9]+)?");
      var allowed = (match!==null && match.length > 0);
      callback(null,allowed);
    }
  }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(limiter.limiterExcludeStatic(['/docs', '/static-docs', '/api-docs']));

var port = process.env.PORT || 8080;

var router = express.Router();

swagger.addModels(models);

swagger.setApiInfo({
  title: "Swagger Sample App",
  description: "This is a sample server Petstore server."
});

app.get('/', function (req, res) {
  res.send('Measurement API provides functionality for unit conversion and manipulating dimensions.');
});

// Status

app.get('/status', function (req, res) {
	var status = limiter.limitStatus(req);
	res.send(status);
});


// Find

app.get('/find', function (req, res) {
	res.send('Find can be used to discover types of dimensions, systems, prefixes, and units.');
});

// TODO: options: include rare, include historical etc

app.get('/find/dimension/:search', function (req, res) {
	var result = getResults(req, res, 'dimension was', function (search) {
		return m.findDimensionPartial(search);
	});
	if (result) {
		res.send(result._config); // TODO - serialize this, include key
	}
});

app.get('/find/dimensions/:search', function (req, res) {
	var results = getResults(req, res, 'dimensions were', function (search) {
		return m.findDimensionsPartial(search);
	});
	sendKeys(res, results);
});

// Note: /find/baseUnits/:search does not exist as it doesn't make much sense
app.get('/find/baseUnit/:search', function (req, res) {
	var result = getResults(req, res, 'base unit was', function (search) {
		return m.findBaseUnitPartial(search);
	});
	if (result) {
		res.send(result._config); // TODO - serialize this, include key
	}
});

app.get('/find/unit/:dimensionKey/:search', function (req, res) {
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

app.get('/find/units/:dimensionKey/:search', function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		var results = getResults(req, res, 'units were', function (search) {
			return m.findUnitsPartial(search, dimension);
		});
		sendKeys(res, results);
	}
});

app.get('/find/system/:search', function (req, res) {
	var result = getResults(req, res, 'system was', function (search) {
		return m.findSystemPartial(search);
	});
	if (result) {
		res.send(result._config); // TODO - serialize this, include key
	}
});

app.get('/find/systems/:search', function (req, res) {
	var results = getResults(req, res, 'systems were', function (search) {
		return m.findSystemsPartial(search);
	});
	sendKeys(res, results);
});

app.get('/find/prefix/:search', function (req, res) {
	var result = getResults(req, res, 'prefix was', function (search) {
		return m.findPrefixPartial(search);
	});
	if (result) {
		res.send(result._config); // TODO - serialize this, include key
	}
});

app.get('/find/prefixes/:search', function (req, res) {
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

// Discover - By Type

var dims = {
	spec: {
		description: 'Find all dimension keys',
		summary: 'A summary is here. And also more text. And more. And also more text. And more. And also more text. And more. And also more text. And more. And also more text. And more.',
		notes: 'Some notes also',
		path: '/dimensions',
		method: 'GET',
		type: 'array',
		items: {
			type: 'string'
		},
		nickname: 'getDimensionKeys'
	},
	action: function (req, res) {
		res.send(Object.keys(m.dimensions));
	}
};
//app.get('/dimensions', dims);

app.get('/units/:dimensionKey', function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		res.send(Object.keys(dimension.units));
	}
});

app.get('/systems', function (req, res) {
	res.send(Object.keys(m.allSystems));
});

app.get('/prefixes', function (req, res) {
	res.send(Object.keys(m.prefixes));
});

// Discover - By Key

app.get('/dimension/:dimensionKey', function (req, res) {
	// TODO: option: verbose - includes all unit information as well
	var dimension = getDimension(req, res);
	if (dimension) {
		res.send(dimension._config); // TODO - serialize this, include key
	}
});

app.get('/baseUnit/:dimensionKey', function (req, res) {
	var dimension = getDimension(req, res);
	if (dimension) {
		var baseUnit = dimension.baseUnit;
		if (!baseUnit) {
			res.status(500).send({ error: 'The requested dimension does not have a base unit'});
			return;
		}
		res.send(baseUnit._config); // TODO - serialize this, include key and dimension key
	}
});

swagger.addGet({
	spec: {
		path: '/unit/{dimensionKey}/{unitKey}',
		method: 'GET',
		nickname: 'getUnit',
		parameters: [
			swagger.paramTypes.path('dimensionKey', 'key of dimension which contains the unit', 'string', undefined, 'time'),
			swagger.paramTypes.path('unitKey', 'key of the unit to be fetched', 'string', undefined, 'second')
		],
		type: 'Unit',
		produces: [
			'application/json',
			'application/xml'
		],
		summary: 'A summary is here. And also more text. An'
	},
	action: function (req, res) {
		var dimension = getDimension(req, res);
		if (dimension) {
			var unit = getUnit(dimension, req, res);
			if (unit) {
				sendResponse(req, res, unit._config);
				
			}
		}
	}
});

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

app.get('/system/:systemKey', function (req, res) {
	var system = getSystem(req, res);
	if (system) {
		res.send(system._config); // TODO - serialize this, include key
	}
});

app.get('/prefix/:prefixKey', function (req, res) {
	var prefix = getPrefix(req, res);
	if (prefix) {
		res.send(prefix._config); // TODO - serialize this, include key
	}
});

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

// Convert - Simple

app.get('/convert/:amount/:dimension/:from/:to', function (req, res) {
	// TODO
});

app.get('/convert/:amount/:from/:to', function (req, res) {
	// TODO
});


swagger.addGet(dims);
swagger.configureSwaggerPaths("", "api-docs", "");
swagger.configure("http://localhost:8080", '0.1');

// Serve up swagger ui at /docs via static route
/*var docs_handler = express.static(__dirname + '/node_modules/swagger-ui/dist');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location' : req.url + '/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});*/
app.use('/static-docs', express.static(__dirname + '/node_modules/swagger-ui/dist'));
app.use('/docs', express.static(__dirname + '/docs'));

app.listen(port);
console.log('Measurement API Service started on port ' + port);
