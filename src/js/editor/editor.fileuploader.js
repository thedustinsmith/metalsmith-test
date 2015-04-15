(function () {
	"use strict";
	var imgurClientID = "ebab107b08ee6ae";
	var bookmark;

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
		if (bookmark) {
            this.composer.selection.setBookmark(bookmark);
			this.currentView.element.focus();
			this.uploadDialog.close();
			bookmark = null;
		}
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

		editor.uploadDialog = new Dialog({
			el: '#upload-dialog'
		});

		FileReaderJS.setupDrop($(".upload-dz")[0], frOpts);
		FileReaderJS.setupClipboard(el, frOpts);

		var imgBtn = $(editor.toolbar.container).find('.ed-image');
		imgBtn.click(function (ev) {
			bookmark = editor.composer.selection.getBookmark();
			ev.preventDefault();
			editor.uploadDialog.open();
		});
	};


	wysihtml5.Editor.prototype.initFileUpload = function (opts) {
		if (!FileReaderJS) {
			throw "wysihtml5 File Upload Error - FileReaderJS required";
		}
		var self = this;
		setTimeout(function () { // toolbar not initialized immediately
			bindFileUploader(self, self.editableElement, opts);
		}, 0);
	};
})();

