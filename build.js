var Metalsmith  = require('metalsmith'),
    each 		= require('metalsmith-each'),
    templates 	= require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    lunr		= require('metalsmith-lunr'),
    less		= require('metalsmith-less'),
    watch 		= require('metalsmith-watch'),
    serve		= require('metalsmith-serve')
    path 		= require('path'),
    swig 		= require('swig'),
    _ 			= require('underscore');

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

// var filePaths = function (opts) {
// 	return function (files, metalsmith, done) {
// 		Object.keys(files).forEach(function (file) {
// 			files[file].path = file;
// 		});
// 		done();
// 	};
// };

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
	loader: swig.setDefaults({
		loader: swig.loaders.fs(__dirname + '/layouts')
	})
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
};

var swigInPlace = _.extend({}, swigOpts, { inPlace: true });


var ms = Metalsmith(__dirname)
	.use(processUrls({
		cleanUrls: true
	}))
	.use(collections({
		stuff: { refer: false }
	}))
	.use(crumbsPlugin())
	.use(each(function (file, name) { // This serves to help swig with template inheritance
		file.filename = name;
	}))
	.use(templates(swigInPlace))
	.use(templates(swigOpts))
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