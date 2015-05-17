(function () {

	var timer;
	var tipElement;
	var tip;
	var tipTemplate = $("#linkTemplate").html();

	function onLinkFocus (ed) {
		var range = ed.composer.selection.getRange(),
			container = range.commonAncestorContainer;

		if (container.nodeType == 3) {
			container = container.parentNode;
		}
		if (container.nodeName === "A") {
			if (tipElement == container) {
				return;
			}
			window.linkEl = container;
			tipElement = container;
			var linkHtml = Mustache.render(tipTemplate, {
				text: container.innerText,
				url: container.href
			});
			timer = setTimeout(function () {
				tip = new Opentip(tipElement, linkHtml, { 
					target: true,
					showOn: null,
					removeElementsOnHide: true,
					hideOn: 'none',
					background: '#ffffff',
					borderColor: '#bada55'
				});
				tip.show();
			}, 250);
		}
		else {
			closeTip();
		}
	}

	function closeTip () {
		clearTimeout(timer);
		tipElement = null;
		if (tip) {
			tip.deactivate();
			tip = null;
		}
	}

	function saveLink (ed, helper) {
		var text = helper.find('[name=linkText]').val(),
			href = helper.find('[name=linkHref]').val();

		tipElement.innerText = text;
		tipElement.href = href;
		closeTip();
	}

	function convertRange (editor, range) {
		var anchor = document.createElement('a');
		anchor.href="";
		range.surroundContents(anchor);
		editor.composer.selection.selectNode(anchor);
		editor.fire('interaction:composer');
	}

	function init (editor, el, o) {

		editor.on('interaction:composer', function (e) {
			onLinkFocus(editor);
		});

		$('body').on('submit', '.link-helper form', function (ev) {
			ev.preventDefault();
			var form = $(ev.currentTarget);
			saveLink(editor, form);
		});

		var btn = $(editor.toolbar.container).find('.ed-link');
		btn.click(function (ev) {
			var r = editor.composer.selection.getRange();
			convertRange(editor, r);
		});
	}

	wysihtml5.Editor.prototype.initLinkHelper = function (opts) {
		var self = this;
		setTimeout(function(){
			init(self, self.editableElement, opts);
		}, 0);
	};

	wysihtml5.Editor.prototype.initHelpers = function () {

	};
})();