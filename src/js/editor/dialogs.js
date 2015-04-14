(function () {
	var overlay = $("<div class='dialog-overlay' />").appendTo("body");
	var openDialog;

	overlay.on('click.dialog', function (ev) {
		if (openDialog) {
			openDialog.close();
		}
	});

	function bindEscape() {
		$('body').on('keyup.dialog', function (ev) {
			if (ev.which === 27 && openDialog) {
				openDialog.close();
			}
		});
	}

	function Dialog (o) {
		var opts = this.options = o || {};
		this.el = opts.el;
		this.initialize();
	};

	Dialog.prototype.initialize = function () {
		var appendTo = this.options.appendTo || $("body");
		this.$wrapper = $("<div class='dialog-wrapper' style='visibility: hidden;' />").appendTo(appendTo);
		this.$el = $(this.el).show().appendTo(this.$wrapper);

		// this.$wrapper.css(this.options.css);
		var w = this.$el.width();
		var h = this.$el.height();

		this.$wrapper.width(w);
		this.$wrapper.height(h);

		this.initialTop = (-1 * h);
		this.$wrapper.css({
			top: this.initialTop,
			left: ($(window).width() - w) / 2,
			visibility: ''
		});
		if (this.options.autoOpen) {
			this.open();
		}
	};

	Dialog.prototype.open = function () {
		openDialog = this;
		this.$wrapper.addClass('dialog-open').css({
			top: 0
		});
		overlay.addClass('dialog-open');
		bindEscape();
	};

	Dialog.prototype.close = function () {
		openDialog = null;
		this.$wrapper.css({
			top: this.initialTop
		}).removeClass('dialog-open')
		overlay.removeClass('dialog-open');
		$('body').off('keyup.dialog');
	};

	window.Dialog = Dialog;
})();