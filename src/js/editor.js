(function (app) {

	var Editor = {
		initClipboard: function () {
			var btn = document.getElementById('copy-btn');
			var copyBtn = new ZeroClipboard(btn);
			copyBtn.on('ready', function () {
				copyBtn.on('copy', function (e) {
					var clipboard = e.clipboardData;
					clipboard.setData("text/plain", document.getElementById('editor').innerHTML);
				});

				var toolTip = new Opentip('#copy-btn', 'HTML Copied', {
					hideDelay: 3,
					target: true
				});
				copyBtn.on('aftercopy', function (e) {
					toolTip.show();
				});
			});
		},
		init: function() {
			var editor = this.editor = new wysihtml5.Editor('editor', {
				toolbar: 'toolbar',
				parserRules:  wysihtml5ParserRules
			});
			editor.initFileUpload();
			this.initClipboard();
		}
	};

	app.Editor = Editor;

})(app);

