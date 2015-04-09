function cleanUrls (opts) {
	opts = opts || {};
	var omitDir = opts.omitDir || ('content' + path.sep);

	return function (files, metalsmith, done) {
		Object.keys(files).forEach(function (file) {
			if (file.indexOf(omitDir) > -1) {
				var replacementFile = file.replace(omitDir, '');
				if (replacementFile.indexOf('index.html') < 0) {
					replacementFile = replacementFile.replace('.html', '/index.html');
				}
				files[replacementFile] = files[file];
				delete files[file];
			}
		});
		done();
	};
};

function fixRelativeResources (opts) {
	var relRoot = opts.relRoot || '';
	return function (files, metalsmith, done) {
		Object.keys(files).forEach(function (fp) {
			var file = files[fp];
			var html = file.contents.toString();
			html = html.replace(/href="\/([a-zA-Z0-9])/g, 'href="/'+ relRoot + "$1")
						.replace(/src="\/([a-zA-Z0-9])/g, 'src="/'+ relRoot + "$1");
			file.contents = new Buffer(html);
		});
		done();
	};
};

function crumbs (opts) {

	return function (files, metalsmith, done) {

		Object.keys(files).forEach(function (filePath) {
			if (!filePath.indexOf('.html')) {
				return;
			}
			var crumbs = [];
			var p = path.normalize(filePath);
			while (p.indexOf(path.sep) > -1) {
				var parent = path.dirname(p);
				crumbs.unshift({
					link: '/' + parent,
					text: parent.substring(parent.lastIndexOf(path.sep) + 1)
				});
				p = parent;
			}

			files[filePath].crumbs = crumbs;
		});

		done();
	};

};

module.exports = {
	cleanUrls: cleanUrls,
	fixRelativeResources: fixRelativeResources,
	crumbs: crumbs
}