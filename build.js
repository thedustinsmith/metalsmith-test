var Metalsmith  	= require('metalsmith'),
    each 			= require('metalsmith-each'),
    templates 		= require('metalsmith-templates'),
    collections 	= require('metalsmith-collections'),
    lunr			= require('metalsmith-lunr'),
    less			= require('metalsmith-less'),
    watch 			= require('metalsmith-watch'),
    serve			= require('metalsmith-serve')
    assets 			= require('metalsmith-assets'),
    helpers 		= require('./tools/helpers'),
    cleanUrls 		= helpers.cleanUrls,
    fixResources 	= helpers.fixRelativeResources,
    crumbs 			= helpers.crumbs,
    path 			= require('path'),
    swig 			= require('swig'),
    _ 				= require('underscore'),
	isDev  			= (process.argv.length === 3 && process.argv[2] === 'dev');

var swigOpts = {
	engine: 'swig',
	varControls:  ['{%=', '%}'],
	locals: { baseUrl: isDev ? '//localhost:8000' : '//thedustinsmith.com/metalsmith-test' },
	loader: swig.setDefaults({
		loader: swig.loaders.fs(__dirname + '/layouts')
	})
};

var swigInPlace = _.extend({}, swigOpts, { inPlace: true });

var ms = Metalsmith(__dirname)
	.use(cleanUrls())
	.use(collections({
		stuff: { refer: false }
	}))
	.use(crumbs())
	.use(each(function (file, name) { // This serves to help swig with template inheritance
		file.filename = name;
	}))
	.use(fixResources({
		relRoot: (isDev) ? '' : 'metalsmith-test/'
	}))
	.use(templates(swigInPlace))
	.use(templates(swigOpts))
	.use(less({
		pattern: '**/all.less',
		useDefaultSourceMap: true
	}))
	.use(assets({
		source: './bower_components',
		destination: './bower_components'
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