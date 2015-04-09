<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>{%=title%} | Metalsmith Page</title>

    <link href="/css/all.css" rel="Stylesheet" type="text/css" />
    {% block head %}
    {% endblock head %}
</head>
<body class="{%= bodyClass %}">
	<header>
		<a href="/" class="brand-header">Foliotek</a>
    <!-- <div class="search-wrap">
      <input type="search" id="search" />
      <button class="search-btn">Search</button>
    </div> -->
	</header>
    <div class="main-wrapper">
        {% include "crumbs.swig" %}

        <h1>{%= title %}</h1>
        {% block contents %}
        {% endblock contents %}

        {% if !hideDisqus %}
        <div id="comments-wrapper">
          <h3>Discussion</h3>
          <div id="disqus_thread"></div>
        </div>
        {% endif %}
    </div>
    <footer>
    </footer>
    <script>
      window.app = {
        baseUrl: '{%= baseUrl %}'
      };
    </script>
    <script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="/js/lunr.js"></script>
    <script src="/js/common.js"></script>
    <script src="/js/search.js"></script>

    <script>
    app.Search.init();
    </script>
    {% block scripts %}

    {% endblock scripts %}
    {% if !hideDisqus %}
    <script type="text/javascript">
      var disqus_shortname = 'metalsmithtest';
      // var disqus_identifier = '';
      // var disqus_title = '';
      // var disqus_url = '';

      (function() {
          var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      })();
  </script>
  {% endif %}
</body>
</html>