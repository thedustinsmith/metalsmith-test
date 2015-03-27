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
    <!-- <div class="search-wrap">
      <input type="search" id="search" />
      <button class="search-btn">Search</button>
    </div> -->
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
        {% block contents %}
        {% endblock contents %}
    </div>

    <footer>
    </footer>
    <script>
      window.app = {
        baseUrl: '{%= baseUrl %}'
      };
    </script>
    <script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="{%= baseUrl %}/js/lunr.js"></script>
    <script src="{%= baseUrl %}/js/common.js"></script>
    <script src="{%= baseUrl %}/js/search.js"></script>

    <script>
    app.Search.init();
    </script>
    {% block scripts %}

    {% endblock scripts %}
</body>
</html>