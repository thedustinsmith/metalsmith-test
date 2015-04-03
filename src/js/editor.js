(function (app) {

	var Editor = {
		init: function() {
			var editor = new wysihtml5.Editor('editor', {
				toolbar: 'toolbar',
				parserRules:  wysihtml5ParserRules
			});
		}
	};

	app.Editor = Editor;

})(app);