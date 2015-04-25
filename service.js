
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	m = require('measurejs'),
	toXml = require("js2xmlparser"),
	limiter = require('./lib/rate_limit');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(limiter.limiterExcludeStatic(['/docs', '/static-docs', '/api-docs']));

var port = process.env.PORT || 8080;

// VERSIONING

var routes = {},
	versions = {},
	routePath = require("path").join(__dirname, "lib/routes"),
	latestRouteKey = 'v1.js';

// Load routes dynamically
require("fs").readdirSync(routePath).forEach(function (file) {
	routes[file] = require("./lib/routes/" + file);
});

// Apply routes to express and set up versions object
for (var routeKey in routes) {
	var route = routes[routeKey];
	provisionVersion(routeKey, route.version.name, route.version.path, route.version.accept);
}
provisionVersion(latestRouteKey, 'Latest', '', 'application/vnd.measurement+json');

function provisionVersion(key, name, path, accept) {
	var route = routes[key];
	versions[name] = {
		path: path,
		accept: accept,
	};
	app.use(path, route);
}

app.get('/versions', function (req, res) {
	res.send(versions);
});

// CROSS-VERSION FUNCTIONALITY

app.get('/', function (req, res) {
	res.send('Measurement API provides functionality for unit conversion and manipulating dimensions.');
});

app.get('/status', function (req, res) {
	var status = limiter.limitStatus(req);
	res.send(status);
});

// DOCUMENTATION

app.use('/api-docs', express.static(__dirname + '/docs/api-docs.json'));
app.use('/static-docs', express.static(__dirname + '/node_modules/swagger-ui/dist'));
app.use('/docs', express.static(__dirname + '/docs'));

// START SERVICE

app.listen(port);
console.log('Measurement API Service started on port ' + port);
