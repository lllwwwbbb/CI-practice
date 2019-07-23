set -x
git reset --hard origin/master
git clean -f
git pull

sh ./auto_build.sh
