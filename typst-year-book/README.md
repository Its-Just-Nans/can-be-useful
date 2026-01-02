# Year book photos in typst

```sh
# create your year_book.csv
# LASTNAME,FIRSTNAME,pic_name.jpg,Country
```

```sh
# for images
cd images_jpg
rm resized_*
fd -e jpg -x convert {} -resize 400x resized_{/}

# for country - download flags from internet
```
