
var express = require('express'),
	app = module.exports = express(),
	fs = require("fs"),
	path = require("path");

var latestVersion = {
	name: 'Latest',
	path: '',
	accept: [
		'application/json',
		'application/xml',
		'application/vnd.measurement+json',
		'application/vnd.measurement+xml'
	]
};

var routes = {},
	versions = [],
	routePath = path.join(__dirname, "routes"),
	highestRouteId = -1,
	latestRouteFileName;

// Load routes dynamically
fs.readdirSync(routePath).forEach(function (file) {
	routes[file] = require("./routes/" + file);
});

// Apply routes to express and set up versions object
for (var routeFileName in routes) {
	var route = routes[routeFileName];
	provisionVersion(routeFileName, route.version);
	// To find the latest api version
	if (route.version.id > highestRouteId) {
		highestRouteId = route.version.id;
		latestRouteFileName = routeFileName;
	}
}

// Apply latest api version
provisionVersion(latestRouteFileName, latestVersion);

function provisionVersion(routeFileName, version) {
	var route = routes[routeFileName];
	versions.push({
		name: version.name,
		path: version.path,
		accept: version.accept,
	});
	app.use(version.path, route);
}

// Reset Server header for cross version and static requests
app.use(function (req, res, next) {
	res.set('Server', 'Measurement/v*');
	next();
});

module.exports.routes = routes;
module.exports.versions = versions;
