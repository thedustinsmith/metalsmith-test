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


var ms = Metalsmith(__dirname)
	.use(cleanUrls())
	.use(collections({
		stuff: { refer: false }
	}))
	.use(crumbs())
	.use(each(function (file, name) { // This serves to help swig with template inheritance
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