var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    layouts     = require('metalsmith-layouts'),
    inPlace     = require('metalsmith-in-place'),
    collections = require('metalsmith-collections'),
    lunr		= require('metalsmith-lunr'),
    less		= require('../metalsmith-less/lib'),
    relative 	= require('metalsmith-relative');

var processUrls = function (opts) {
	opts = opts || {};
	var omitDir = opts.omitDir || 'content/';
	var cleanUrls = opts.cleanUrls || false;

	return function (files, metalsmith, done) {
		Object.keys(files).forEach(function (file) {
			if (file.indexOf(omitDir) > -1) {
				var replacementFile = file.replace(omitDir, '');
				if (cleanUrls && replacementFile.indexOf('index.html') < 0) {
					replacementFile = replacementFile.replace('.html', '/index.html');
				}
				files[replacementFile] = files[file];
				delete files[file];
			}
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
};


var swigOpts = {
	engine: 'swig',
	varControls:  ['{%=', '%}'],
	locals: {
		resource: function(path, resource) {
			while (path.indexOf('/') > 0) {
				resource = "../" + resource;
				path = path.substring(path.indexOf('/') + 1);
			}
			return resource;
		}
	}
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
	.use(relative())
	.use(less({
		pattern: '**/all.less',
		useDefaultSourceMap: true
	}))
	.use(lunr())
	.destination('./build')
	.build(function (err, files) {
		if(err) throw err;
	});