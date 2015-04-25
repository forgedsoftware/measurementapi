
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	m = require('measurejs'),
	toXml = require("js2xmlparser"),
	limiter = require('./lib/rate_limit'),
	acceptHeader = require('./lib/accept_header'),
	h = require('./lib/helpers');

var staticPaths = ['/docs', '/static-docs', '/api-docs'];
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(limiter.limiterExcludeStatic(staticPaths));

// VERSIONING

var routes = {},
	versions = [],
	routePath = require("path").join(__dirname, "lib/routes"),
	latestRouteKey = 'v1.js';

// Load routes dynamically
require("fs").readdirSync(routePath).forEach(function (file) {
	routes[file] = require("./lib/routes/" + file);
});

// Utilise accept header versioning
app.use(acceptHeader(routes, staticPaths));

// Apply routes to express and set up versions object
for (var routeKey in routes) {
	var route = routes[routeKey];
	provisionVersion(routeKey, route.version.name, route.version.path, route.version.accept);
}
provisionVersion(latestRouteKey, 'Latest', '', [
	'application/json',
	'application/xml',
	'application/vnd.measurement+json',
	'application/vnd.measurement+xml'
]);

function provisionVersion(key, name, path, accept) {
	var route = routes[key];
	versions.push({
		name: name,
		path: path,
		accept: accept,
	});
	app.use(path, route);
}

app.get('/versions', function (req, res) {
	h.sendResponse(req, res, versions, 'versions');
});

// CROSS-VERSION FUNCTIONALITY

app.get('/', function (req, res) {
	// As json/xml??
	res.send('Measurement API provides functionality for unit conversion and manipulating dimensions.');
});

app.get('/status', function (req, res) {
	var status = limiter.limitStatus(req);
	h.sendResponse(req, res, status, 'status');
});

// DOCUMENTATION

app.use('/api-docs', express.static(__dirname + '/docs/api-docs.json'));
app.use('/static-docs', express.static(__dirname + '/node_modules/swagger-ui/dist'));
app.use('/docs', express.static(__dirname + '/docs'));

// START SERVICE

app.listen(port);
console.log('Measurement API Service started on port ' + port);
