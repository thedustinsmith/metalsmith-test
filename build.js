var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    templates  = require('metalsmith-templates');
    // permalinks = require('metalsmith-permalinks');


var processUrls = function (opts) {
	opts = opts || {};
	var omitDir = opts.omitDir || 'content/';
	var cleanUrls = opts.cleanUrls || false;

	return function (files, metalsmith, done) {
		for (var file in files) {
			var replacementFile = file.replace(omitDir, '');
			if (cleanUrls && replacementFile.indexOf('index.html') < 0) {
				replacementFile = replacementFile.replace('.html', '/index.html');
			}
			files[replacementFile] = files[file];
			delete files[file];
		}
		done();
	}
};

Metalsmith(__dirname)
	.use(markdown())
	.use(templates({
		engine: 'swig',
		varControls: ['{%=', '%}']
	}))
	.use(processUrls({
		cleanUrls: true
	}))
	.destination('./build')
	.build(function (err, files) {
		if(err) throw err;
	});