
var acceptHeader = require('../lib/accept_header.js'),
	should = require('should');

suite('Accept Headers - parsing', function () {

	test('basic accept header parses successfully', function () {
		var acceptStr = 'application/json';
		var result = parse(acceptStr, 1);
		result.acceptHeader[0].should.have.property('acceptType', acceptStr);
		result.acceptHeader[0].should.have.property('version', undefined);
	});

	test('multiple comma-separated mime type in accept header parses successfully', function () {
		var result = parse('application/json,application/xml,text/html', 3);
		result.acceptHeader[0].should.have.property('acceptType', 'application/json');
		result.acceptHeader[1].should.have.property('acceptType', 'application/xml');
		result.acceptHeader[2].should.have.property('acceptType', 'text/html');
	});

	test('multiple space-separated mime type in accept header parses successfully', function () {
		var result = parse('   application/json application/xml,,  text/html  ', 3);
		result.acceptHeader[0].should.have.property('acceptType', 'application/json');
		result.acceptHeader[1].should.have.property('acceptType', 'application/xml');
		result.acceptHeader[2].should.have.property('acceptType', 'text/html');
	});

	test('more complex mime type in accept header parses successfully', function () {
		var result = parse('application/xhtml+html', 1);
		result.acceptHeader[0].should.have.property('acceptType', 'application/html');
	});

	test('vender specific mime type in accept header parses successfully', function () {
		var result = parse('application/vnd.measurement.hello.world.abcsed+xml', 1);
		result.acceptHeader[0].should.have.property('acceptType', 'application/xml');
	});

	test('vender specific mime type with version in accept header parses successfully', function () {
		var result = parse('application/vnd.measurement.world.abcsed.v6+json', 1);
		result.acceptHeader[0].should.have.property('acceptType', 'application/json');
		result.acceptHeader[0].should.have.property('version', 'v6');
	});

	test('vender specific mime type with version in middle of accept header parses successfully', function () {
		var result = parse('application/vnd.measurement.v7.world.abcsed+html', 1);
		result.acceptHeader[0].should.have.property('acceptType', 'application/html');
		result.acceptHeader[0].should.have.property('version', 'v7');
	});

	test('wildcard mime type accept header parses successfully', function () {
		var result = parse('*/*', 1);
		result.acceptHeader[0].should.have.property('acceptType', '*/*');
	});

	test('parameters in mime type accept header parses successfully', function () {
		// Use default chrome mime-types
		var result = parse('text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 5);
		result.acceptHeader[1].should.have.property('acceptType', 'application/xml');
	});

	test('expected v0 mimetypes in accept header parses successfully', function () {
		var result = parse('application/vnd.measurement.v0+json application/vnd.measurement.v0+xml', 2);
		result.acceptHeader[0].should.have.property('acceptType', 'application/json');
		result.acceptHeader[0].should.have.property('version', 'v0');
		result.acceptHeader[1].should.have.property('acceptType', 'application/xml');
		result.acceptHeader[1].should.have.property('version', 'v0');
	});

	test('empty accept header returns zero results and no errors', function () {
		parse('', 0, false);
	});

	test('bad mime type accept header sends error', function () {
		parse('texthtml', 0, true);
		parse('texthtml/', 0, true);
		parse('/dsfd', 0, true);
	});

	function parse(str, count, errorExpected) {
		var reqObj = { headers: { accept: str } };
		var result = acceptHeader.parseAcceptHeaders(reqObj, { status: function () { return { send: function () {} }} });
		result.should.have.property('acceptHeader').with.lengthOf(count);
		result.should.have.property('errorFound');
		if (errorExpected) {
			result.errorFound.should.be.true;
		} else {
			result.errorFound.should.be.false;
		}
		return result;
	}

});