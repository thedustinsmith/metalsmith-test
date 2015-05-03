(function (app) {

	// https://gist.github.com/thedustinsmith/4394c416a316e8046753
	// Copied from Facebook's logic
	// I couldn't find a reliable search to keep finding it.
	// Depends on existing scripts on the page
	function loadScript (url, callback) {
	  (function (d, s, id) {
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) { callback(); }
	    js = d.createElement(s); js.id = id;
	    js.onload = function () {
	        callback();
	    };
	    js.src = url; // url
	    fjs.parentNode.insertBefore(js, fjs);
	  }(document, 'script', 'dynamic-script'));
	}

	var cssResources = [
		'/css/editor.compiled.css',
		'/bower_components/fontawesome/css/font-awesome.css'
	];
	var jsUrl = "/js/editor.compiled.js";
	var templateUrl = '/editor-templates/';

	var Editor = function (contentId) {
		var self = this; 
		$('body').addClass('editor');
		this.contentSelector = contentId;
		this.contentEl = document.getElementById(contentId);
		this.$contentEl = $(this.contentEl);
		this.load(function () {
			self.$contentEl.prop("contenteditable", true);
			setTimeout(function(){
				self.init();
			}, 1000);
		});
	};

	Editor.prototype.initClipboard = function () {
		var self = this;
		var btn = document.getElementById('copy-btn');
		ZeroClipboard.config({
			swfPath: '/bower_components/zeroclipboard/dist/ZeroClipboard.swf'
		});
		var copyBtn = new ZeroClipboard(btn);
		copyBtn.on('ready', function () {
			copyBtn.on('copy', function (e) {
				var clipboard = e.clipboardData;
				clipboard.setData("text/plain", self.contentEl.innerHTML);
			});

			var toolTip = new Opentip('#copy-btn', 'HTML Copied', {
				hideDelay: 3,
				target: true
			});
			copyBtn.on('aftercopy', function (e) {
				toolTip.show();
			});
		});
	};

	Editor.prototype.load = function (cb) {
		var self = this,
			def = $.Deferred(),
			templatePromise = def.promise();

		cssResources.forEach(function (u) {
			$("head").append('<link type="text/css" rel="Stylesheet" href="' + u + '" />');
		});

		this.templateContainer = $('<div id="editor-templates" />').appendTo("body").hide();
		this.templateContainer.load(templateUrl, function () {
			def.resolve();
		});
		templatePromise.done(function(){
			self.toolbar = self.templateContainer.find("#toolbar").hide().insertBefore(self.$contentEl);
			self.toolbar.fadeIn();
		});
		loadScript(jsUrl, function() { 
			templatePromise.done(function () {
				cb();
			});
		});
	};

	Editor.prototype.init = function () {
		var editor = this.editor = new wysihtml5.Editor(this.contentSelector, {
			toolbar: 'toolbar',
			parserRules:  wysihtml5ParserRules
		});
		this.initClipboard();

		$('#toolbar').on('mousedown', '[data-wysihtml-helper]', function (ev) {
			ev.preventDefault();
		});
		editor.initFileUpload();
		editor.initLinkHelper();
	};

	window.MetalEditor = Editor;
})();

