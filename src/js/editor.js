(function (app) {

	var Editor = {
		init: function() {
			var editor = this.editor = new wysihtml5.Editor('editor', {
				toolbar: 'toolbar',
				parserRules:  wysihtml5ParserRules
			});
			editor.initFileUpload();
		}
	};

	app.Editor = Editor;

})(app);