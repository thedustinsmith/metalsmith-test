<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>{%=title%} | Metalsmith Page</title>
</head>
<body>
    <div class="main-wrapper">
        {%= contents | safe %}
    </div>
</body>
</html>