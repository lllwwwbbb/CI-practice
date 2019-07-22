git reset --hard origin/master
git clean -f
git pull
git checkout master
pm2 flush server.js
pm2 reload server.js
