(function (app) {

var Search = {
	init: function () {
		var self = this;
		$.getJSON(app.baseUrl + '/searchIndex.json', function (j) {
			self.idx = lunr.Index.load(j);
		});

		$(".search-btn").on("click", function (ev) {
			var results = self.idx.search($("#search").val());
			log(results);
		});
	}
};

app.Search = Search;

})(app);