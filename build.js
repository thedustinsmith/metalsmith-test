var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    layouts     = require('metalsmith-layouts'),
    inPlace     = require('metalsmith-in-place'),
    // templates 	= require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    lunr		= require('metalsmith-lunr'),
    less		= require('metalsmith-less'),
    relative 	= require('metalsmith-relative'),
    watch 		= require('metalsmith-watch'),
    serve		= require('metalsmith-serve')
    path 		= require('path');

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

var crumbsPlugin = function (opts) {

	return function (files, metalsmith, done) {

		Object.keys(files).forEach(function (filePath) {
			if (!filePath.indexOf('.html')) {
				return;
			}
			var crumbs = [];
			var p = filePath;
			while (p.indexOf('/') > -1) {
				var parent = path.dirname(p);
				crumbs.unshift({
					link: '/' + parent,
					text: parent.substring(parent.lastIndexOf('/') + 1)
				});
				p = parent;
			}

			files[filePath].crumbs = crumbs;
		});

		done();
	};

};

var isDev = process.argv.length === 3 && process.argv[2] === 'dev';
var swigOpts = {
	engine: 'swig',
	varControls:  ['{%=', '%}'],
	directory: 'layouts'
};
swigOpts.locals = {

	baseUrl: isDev ? '//localhost:8000' : '//thedustinsmith.com/metalsmith-test',

	resource: function(path, resource) {
		while (path.indexOf('/') > 0) {
			resource = "../" + resource;
			path = path.substring(path.indexOf('/') + 1);
		}
		return resource;
	}
}


var ms = Metalsmith(__dirname)
	.use(markdown())
	.use(processUrls({
		cleanUrls: true
	}))
	.use(filePaths())
	.use(collections({
		stuff: { refer: false }
	}))
	.use(crumbsPlugin())
	.use(inPlace(swigOpts))
	.use(layouts(swigOpts))
	// .use(templates(swigOpts))
	.use(relative())
	.use(less({
		pattern: '**/all.less',
		useDefaultSourceMap: true
	}))
	.use(lunr())
	.destination('./build');

if (isDev) {
	ms.use(watch("**/*.*")).use(serve({
		port: 8000,
		verbose: true
	}));
}
ms.build(function (err, files) {
	if(err) throw err;
});