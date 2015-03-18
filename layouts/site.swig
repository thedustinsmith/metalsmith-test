<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>{%=title%} | Metalsmith Page</title>

    <link href="{%= resource(path, 'css/all.css') %}" rel="Stylesheet" type="text/css" />
</head>
<body>
	<header>
		<a href="/" class="brand-header">Foliotek</a>
	</header>
    <div class="main-wrapper">
        {%= contents | safe %}
    </div>

    <footer>
    </footer>
    <script src="{%= resource(path, 'js/lunr.js') %}"></script>
</body>
</html>