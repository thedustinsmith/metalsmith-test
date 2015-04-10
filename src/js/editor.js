(function (app) {

	var Editor = {
		initLinkHelper: function (editor) {
			var linkHelpTimer;
			var tipElement;
			var tip;
			editor.on('interaction:composer', function (e) {
				var range = editor.composer.selection.getRange();
				var container = range.commonAncestorContainer;
				if (container.nodeType == 3) {
					container = container.parentNode;
				}
				if (container.nodeName === "A") {
					if (tipElement == container) {
						return;
					}
					tipElement = container;
					linkHelpTimer = setTimeout(function () {
						tip = new Opentip(tipElement, 'this is a link', { 
							target: true,
							showOn: null,
							removeElementsOnHide: true,
							hideOn: 'none'
						});
						tip.show();
					}, 1000);
				}
				else {
					clearTimeout(linkHelpTimer);
					tipElement = null;
					if (tip) {
						tip.deactivate();
						tip = null;
					}
				}
			});
		},
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
			this.initLinkHelper(editor);
		}
	};

	app.Editor = Editor;

})(app);

