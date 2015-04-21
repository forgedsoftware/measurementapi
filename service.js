
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var m = require('measurejs');
var cors = require("cors");

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

// VERSIONING

var VERSIONS = {
	'Pre-Production': {
		path: '/v0',
		accept: 'application/vnd.measurement.v0+json'
	},
	'Version 1': {
		path: '/v1',
		accept: 'application/vnd.measurement.v1+json'
	},
	'Latest': {
		path: '',
		accept: 'application/vnd.measurement+json'
	},
};

var latestVersionPath = '/v1';

app.get('/versions', function (req, res) {
	res.send(VERSIONS);
});

for (var k in VERSIONS) {
	if (VERSIONS[k].path !== '') {
		app.use(VERSIONS[k].path, require('./lib/routes' + VERSIONS[k].path));
	} else {
		app.use(VERSIONS[k].path, require('./lib/routes' + latestVersionPath));
	}
}

// CROSS-VERSION FUNCTIONALITY

app.get('/', function (req, res) {
	res.send('Measurement API provides functionality for unit conversion and manipulating dimensions.');
});

app.get('/status', function (req, res) {
	var status = limiter.limitStatus(req);
	res.send(status);
});

app.use('/api-docs', express.static(__dirname + '/docs/api-docs.json'));
app.use('/static-docs', express.static(__dirname + '/node_modules/swagger-ui/dist'));
app.use('/docs', express.static(__dirname + '/docs'));

app.listen(port);
console.log('Measurement API Service started on port ' + port);
