var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    layouts     = require('metalsmith-layouts'),
    inPlace     = require('metalsmith-in-place'),
    collections = require('metalsmith-collections');

var processUrls = function (opts) {
	opts = opts || {};
	var omitDir = opts.omitDir || 'content/';
	var cleanUrls = opts.cleanUrls || false;

	return function (files, metalsmith, done) {
		Object.keys(files).forEach(function (file) {
			var replacementFile = file.replace(omitDir, '');
			if (cleanUrls && replacementFile.indexOf('index.html') < 0) {
				replacementFile = replacementFile.replace('.html', '/index.html');
			}
			files[replacementFile] = files[file];
			delete files[file];
		});
		done();
	};
};

var filePaths = function (opts) {

	return function (files, metalsmith, done) {
		Object.keys(files).forEach(function (file) {
			files[file].path = file;
		});
		done();
	};
}
var swigOpts = {
	engine: 'swig',
	varControls:  ['{%=', '%}']
};
Metalsmith(__dirname)
	.use(markdown())
	.use(processUrls({
		cleanUrls: true
	}))
	.use(filePaths())
	.use(collections({
		stuff: { refer: false }
	}))
	.use(inPlace(swigOpts))
	.use(layouts(swigOpts))

	.destination('./build')
	.build(function (err, files) {
		if(err) throw err;
	});