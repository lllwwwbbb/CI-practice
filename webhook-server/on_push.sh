git reset --hard origin/master
git clean -f
git pull

sh -x ./auto_build.sh
