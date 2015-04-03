#!/bin/bash
bower install
node build.js
( cd build
 git init
 git config user.name "${GIT_NAME}"
 git config user.email "${GIT_EMAIL}"
# cp ../CNAME ./CNAME
# cp ../countryiso.js ./countryiso.js
 git add .
 git commit -m "Deployed to Github Pages"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)