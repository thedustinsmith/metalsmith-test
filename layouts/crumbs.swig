{% for crumb in crumbs %}
  {% if loop.first %}<div class="crumb-container"><ul>{% endif %}
  <li>
  {% if !loop.last %}<a href="{%= crumb.link %}">{% endif %}
  {%= crumb.text %}
  {% if !loop.last %}</a>{% endif %}
  </li>
  {% if loop.last %}</ul></div>{% endif %}
{% endfor %}