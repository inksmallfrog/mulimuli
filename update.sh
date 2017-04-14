gulp
git add .
if [ $1 ] ; then
    git commit -m '$f1'
else
    git commit -m `date "+%Y-%m-%d %H:%M:%S"`
fi
