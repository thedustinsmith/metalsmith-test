var mEditor;
$(document).bind('keydown', function (ev) {
	var ctrlOrMeta = ev.ctrlKey || ev.metaKey;
	if (ctrlOrMeta && ev.shiftKey && ev.keyCode === 69) {
		mEditor = new MetalEditor('content');
	}
});