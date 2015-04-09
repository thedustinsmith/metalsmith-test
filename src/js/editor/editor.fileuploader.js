(function () {
	"use strict";
	var imgurClientID = "ebab107b08ee6ae";

	function insertPlaceholder (ed) {
		var id = +(new Date);
		var phImg = '<img src="/images/ring.svg" id="' + id + '" />';
		ed.composer.commands.exec("insertHTML", phImg);
		return id;
	};

	function uploadImg (b64) {
		b64 = b64.replace('data:image/png;base64,', '');
		return $.ajax({
			url: 'https://api.imgur.com/3/upload',
			type: 'POST',
		    datatype: "json",
		    data: {
		    	image: b64,
		    	type: 'base64'
		    },
			headers: {
				'Authorization': 'Client-ID ' + imgurClientID
			}
		});
	};

	function onFileDrop (e) {
		var id = insertPlaceholder(this);
		var upload = uploadImg(e.target.result);
		upload.done(function (resp) {
			document.getElementById(id).src = resp.data.link;
		});
	};

	function bindFileUploader (editor, el, opts) {
		var frOpts = {
			readAs: 'DataURL',
			on: {
				load: onFileDrop.bind(editor)
			}
		};

		FileReaderJS.setupDrop(el, frOpts);
		FileReaderJS.setupClipboard(el, frOpts);		
	};


	wysihtml5.Editor.prototype.initFileUpload = function (opts) {
		if (!FileReaderJS) {
			throw "wysihtml5 File Upload Error - FileReaderJS required";
		}
		bindFileUploader(this, this.editableElement, opts);
	};
})();

