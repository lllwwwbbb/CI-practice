git reset --hard origin/master
git clean -f
git pull
git checkout master

cnpm i
pm2 start server
