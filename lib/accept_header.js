
module.exports = function (routes, crossVersionPaths) {
	return function (req, res, next) {
		var errorFound, acceptHeader = [];

		// Split and attempt to process accept header
		req.headers.accept.split(/[\s,]+/).forEach(function (acceptType) {
			var match,
				headerRegex = /^(\*|.+)\/((.+\.)+(v\d+)\+|(.*)\+)?(\*|\w+)(;.+)?$/g;
			acceptType = acceptType.trim();
			if (acceptType.length === 0) {
				return;
			}
			match = headerRegex.exec(acceptType);
			if (match) {
				acceptHeader.push({
					version: match[4],
					acceptType: match[1] + '/' + match[6]
				});
			} else {
				if (!errorFound) {
					res.status(400).send('Error: Accept header syntax is malformed');
				}
				errorFound = true;
			}
		});
		
		setFoundAcceptTypes(req, res, acceptHeader);
		modifyUrl(req, res, routes, acceptHeader, crossVersionPaths);

		if (!errorFound) {
			next();
		}
	};
};

// Set the found accept types
function setFoundAcceptTypes (req, res, acceptHeader) {
	req.headers.accept = acceptHeader.map(function (type) {
		return type.acceptType;
	}).join(' ');
}

// Modify the url path if:
	// it is specified in the first accept header type
	// and url does not use explicit versioning
	// and the url is not to a static page
	// and the specified version exists
function modifyUrl (req, res, routes, acceptHeader, crossVersionPaths) {
	var hasVersionRegex = /^\/v\d+\//g;
	if (acceptHeader.length > 0 && acceptHeader[0].version && hasVersionRegex.exec(req.url)) {
		var foundVersion, isStatic, routeKey, route;

		isStatic = crossVersionPaths.some(function (p) {
			return startsWith(req.url, p);
		});
		for (routeKey in routes) {
			route = routes[routeKey];
			if (route.version.path === '/' + acceptHeader[0].version) {
				foundVersion = route.version.path;
			}
		}
		if (!isStatic && foundVersion) {
			req.url = foundVersion + req.url;
		}
	}
}

function startsWith (value, strStart) {
	return value.lastIndexOf(strStart, 0) === 0;
}