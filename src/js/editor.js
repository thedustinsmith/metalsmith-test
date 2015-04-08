(function (app) {

	var Editor = {
		insertPlaceholderImage: function (id) {
			var editor = this.editor;
			var html = '<img src="/images/ring.svg" id="' + id + '" />';
			editor.composer.commands.exec("insertHTML", html);
		},
		uploadImage: function (b64) {
			var id = +(new Date);
			this.insertPlaceholderImage(id);
			var clientId = 'ebab107b08ee6ae';
			b64 = b64.replace('data:image/png;base64,', '');
			var upload = $.ajax({
				url: 'https://api.imgur.com/3/upload',
				type: 'POST',
			    datatype: "json",
			    data: {
			    	image: b64,
			    	type: 'base64'
			    },
				headers: {
					'Authorization': 'Client-ID ' + clientId
				}
			});
			upload.done(function (resp) {
				$("img#" + id).attr('src', resp.data.link);
			});
		},
		onFileDrop: function (e, file) {
			this.uploadImage(e.target.result);
		},
		initFileReader: function () {
			var fileOpts = {
				readAs: 'DataURL',
				on: {
					load: this.onFileDrop.bind(this)
				}
			}
			FileReaderJS.setupDrop(document.getElementById('editor'), fileOpts);
			FileReaderJS.setupClipboard(document.getElementById('editor'), fileOpts);				
		},
		init: function() {
			var editor = this.editor = new wysihtml5.Editor('editor', {
				toolbar: 'toolbar',
				parserRules:  wysihtml5ParserRules
			});
			this.initFileReader();
		}
	};

	app.Editor = Editor;

})(app);