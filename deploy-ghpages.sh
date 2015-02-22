#!/bin/bash
node build.js
( cd build
 git init
 git config user.name "Dustin Smith"
 git config user.email "thedustinsmith@gmail.com"
# cp ../CNAME ./CNAME
# cp ../countryiso.js ./countryiso.js
 git add .
 git commit -m "Deployed to Github Pages"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)