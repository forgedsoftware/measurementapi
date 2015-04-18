// Based on express-rate-limit - https://github.com/nfriedly/express-rate-limit

var hourlyHits = {},
	burstHits = {};

var options = {
	hourlyDurationMs: 1000 * 60 * 60, // 1hr
	hourlyMax: 500,
	burstDurationMs: 1000 * 60 * 2, // 2 mins
	burstMax: 50
};

var ipWhitelist = [
	'127.0.0.1'
];

function recordHit(ip, durationMs, hits, res) {
	if (typeof hits[ip] !== 'number') {
		hits[ip] = 0; // first one's free ;)
	} else {
		hits[ip]++;
	}

	setTimeout(function () {
		// cleanup
		if (typeof hits[ip] === 'number') {
			hits[ip]--;
			if (hits[ip] <= 0) {
				delete hits[ip];
			}
		}
	}, durationMs);
}

module.exports.limitStatus = function (req) {
	var ip = req.ip;
	var onWhitelist = ipWhitelist.some(function (ipW) {
		return (ip === ipW);
	});

	var hHits = hourlyHits[ip];
	if (typeof hHits !== 'number') {
		hHits = 0;
	}
	var bHits = burstHits[ip];
	if (typeof bHits !== 'number') {
		bHits = 0;
	}
	return {
		hourly: {
			maxRequests: (onWhitelist) ? 'unlimited' : options.hourlyMax,
			remainingRequests: (onWhitelist) ? 'unlimited' : options.hourlyMax - hHits
		},
		burst: {
			maxRequests: (onWhitelist) ? 'unlimited' : options.burstMax,
			durationMs: options.burstDurationMs,
			remainingRequests: (onWhitelist) ? 'unlimited' : options.burstMax - bHits,
		}
	};
}

module.exports.limiter = function () {
	return function (req, res, next) {
		var ip = req.ip;

		// Exclude IP in Whitelist
		var onWhitelist = ipWhitelist.some(function (ipW) {
			return (ip === ipW);
		});
		if (onWhitelist) {
			next();
			return;
		}

		// Record
		recordHit(ip, options.hourlyDurationMs, hourlyHits, res);
		recordHit(ip, options.burstDurationMs, burstHits, res);
		if (hourlyHits[ip] >= options.hourlyMax || burstHits[ip] >= options.burstMax) {
			// 429 status = Too Many Requests (RFC 6585)
			res.status(429).end('Too many requests, please try again later. Burst max: ' + options.burstMax + ' Hourly max: ' + options.hourlyMax);
		} else {
			next();
		}
	};
};

module.exports.limiterExcludeStatic = function (staticPaths) {
	var limiterFunc = module.exports.limiter();
	return function (req, res, next) {
		var path, isStatic;
		path = req._parsedUrl.pathname;
		isStatic = staticPaths.some(function (p) {
			return startsWith(path, p);
		});
		return (isStatic) ? next() : limiterFunc(req, res, next);
	};
};

// HELPER FUNCS

function startsWith (value, strStart) {
	return value.lastIndexOf(strStart, 0) === 0;
}
