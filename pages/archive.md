---
layout: page
title: Archive
permalink: /pages/archive/
---

{% assign postsByYear = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
<div class="archive-list">
{% for year in postsByYear %}
<h3 class="archive-year">{{ year.name }}</h3>
{% for post in year.items %}
<div class="archive-item">
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <time>{{ post.date | date: "%b %d" }}</time>
</div>
{% endfor %}
{% endfor %}
</div>