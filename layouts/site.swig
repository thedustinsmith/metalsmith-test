<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>{%=title%} | Metalsmith Page</title>

    <link href="{%= baseUrl %}/css/all.css" rel="Stylesheet" type="text/css" />
</head>
<body>
	<header>
		<a href="{%= baseUrl %}" class="brand-header">Foliotek</a>
	</header>
    <div class="main-wrapper">
        {% for crumb in crumbs %}
          {% if loop.first %}<div class="crumb-container"><ul>{% endif %}
          <li>
          {% if !loop.last %}<a href="{%= baseUrl %}{%= crumb.link %}">{% endif %}
          {%= crumb.text %}
          {% if !loop.last %}</a>{% endif %}
          </li>
          {% if loop.last %}</ul></div>{% endif %}
        {% endfor %}

        <h1>{%= title %}</h1>
        {%= contents | safe %}
    </div>

    <footer>
    </footer>
    <script src="{%= baseUrl %}/js/lunr.js"></script>
</body>
</html>