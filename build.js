var Metalsmith  	= require('metalsmith'),
    each 			= require('metalsmith-each'),
    templates 		= require('metalsmith-templates'),
    collections 	= require('metalsmith-collections'),
    lunr			= require('metalsmith-lunr'),
    less			= require('metalsmith-less'),
    watch 			= require('metalsmith-watch'),
    serve			= require('metalsmith-serve')
    assets 			= require('metalsmith-assets'),
    concat			= require('metalsmith-concat'),
    helpers 		= require('./tools/helpers'),
    cleanUrls 		= helpers.cleanUrls,
    fixResources 	= helpers.fixRelativeResources,
    crumbs 			= helpers.crumbs,
    path 			= require('path'),
    swig 			= require('swig'),
	isDev  			= (process.argv.length === 3 && process.argv[2] === 'dev');

/* Swig Options */
swig.setDefaults({
	loader: swig.loaders.fs(__dirname + '/layouts'),
	varControls: ['{%=', '%}'],
	locals: { baseUrl: isDev ? '//localhost:8000' : '//thedustinsmith.com/metalsmith-test' }
});
var swigOpts = {
	engine: 'swig'
};
var swigInPlace = {
	engine: 'swig',
	inPlace: true
};
/* End Swig Opts */


/* Editor Compiled */
var editorJs = {
	files: [
		'bower_components/zeroclipboard/dist/ZeroClipboard.min.js',
		'bower_components/mustache/mustache.min.js',
		'bower_components/opentip/downloads/opentip-native.js',
		'bower_components/wysihtml/dist/wysihtml5x-toolbar.min.js',
		'bower_components/wysihtml/parser_rules/advanced_and_extended.js',
		'js/editor/dialogs.js',
		'js/editor/filereader.js',
		'js/editor/editor.fileuploader.js',
		'js/editor/editor.links.js'
	],
	output: 'js/editor.compiled.js'
};
var editorCss = {
	files: [
		'bower_components/opentip/css/opentip.css',
		'css/editor.css'
	],
	output: 'css/editor.compiled.css'
};
/* End Editor Compiled */


var ms = Metalsmith(__dirname)
	.use(cleanUrls())
	.use(collections({
		stuff: { refer: false }
	}))
	.use(crumbs())
	.use(each(function (file, name) { 
		// This serves to help swig with template inheritance
		file.filename = name;
	}))
	.use(templates(swigInPlace))
	.use(templates(swigOpts))
	.use(fixResources({
		relRoot: (isDev) ? '' : 'metalsmith-test/'
	}))
	.use(less({
		pattern: '**/{all,editor}.less',
		useDefaultSourceMap: true
	}))
	.use(assets({
		source: './bower_components',
		destination: './bower_components'
	}))
	.use(concat(editorJs))
	.use(concat(editorCss))
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