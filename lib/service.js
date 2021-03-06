
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	limiter = require('./rate_limit'),
	acceptHeader = require('./accept_header'),
	versioning = require('./versioning'),
	h = require('./helpers');

var staticPaths = ['/docs', '/static-docs'];
var crossVersionPaths = ['/versions', '/status'];

var port = process.env.PORT || 8080;

// MIDDLEWARE

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(limiter.limiterExcludeStatic(staticPaths));
app.use(acceptHeader(versioning.routes, crossVersionPaths, staticPaths));

// SETUP VERSIONED ENDPOINTS

app.use(versioning);

// CROSS-VERSION ENDPOINTS

app.get('/versions', function (req, res) {
	h.sendResponse(req, res, versioning.versions, 'versions');
});

app.get('/status', function (req, res) {
	var status = limiter.limitStatus(req);
	h.sendResponse(req, res, status, 'status');
});

// DOCUMENTATION

app.use('/static-docs', express.static(__dirname + '/../node_modules/swagger-ui/dist'));
app.use('/docs', express.static(__dirname + '/../docs'));

// START SERVICE

app.listen(port);
console.log('Measurement API Service started on port ' + port);
