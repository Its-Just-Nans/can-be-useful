folder=test
git remote add $folder git@github.com:Its-Just-Nans/$folder.git
git fetch $folder
git checkout -b $folder $folder/main
mkdir $folder
git mv !($folder) $folder/ # repeat as necessary for each file/dir
git mv .gitignore $folder/
git mv .vscode $folder/
git commit -m "Moved stuff to $folder"
git checkout main
git merge -m "Merge repo $folder into main" $folder --allow-unrelated-histories # should add ZZZ/ to master
git commit
git remote rm $folder && git branch -D $folder && git push
