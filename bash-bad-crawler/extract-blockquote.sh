#!/bin/sh

rm -R new
mkdir new
cd ./new || exit

wget http://langevin.univ-tln.fr/cours/ABC/cdebut.html
grep -n '<blockquote' cdebut.html | sed -e 's;\(.*\):.*;\1;g' > tmp.txt

echo "Don't be panic, the program is (normally) running"
echo ''
compteur=$(wc -l < cdebut.html)
compteur2='1'
for a in $(seq 1 "$compteur")
do
	ligneQuote=$(sed -n "$compteur2"p tmp.txt)
	if [ "$a" = "$ligneQuote" ]
	then
		check='0'
		z="$a"
		while [ "$check" != '1' ]
		do
			variable=$(sed -n "$z"p cdebut.html)
			variabletest=$(sed -n "$z"p cdebut.html | sed -e 's:.*</blockquote>.*:test\ntest:g'| wc -l)
			echo "$variable" >> resultat.txt
			if [ "$variabletest" = '2' ]
			then
				check='1'
			else
				z=$((z+1))
			fi
		done
		compteur2=$(($compteur2 + 1))
		echo "\n" >> resultat.txt
		
	fi
done
rm ./tmp.txt
nouvVar=$(wc -l < ./resultat.txt)
sed -e 's:^<br>::g' ./resultat.txt | sed -e 's:^<blockquote>::g' | sed -e 's:^</blockquote>::g' | sed -e 's:</blockquote>$::g' > tmp2.txt
sed -e 's:^<blockquote>$::g' ./tmp2.txt > tmp3.txt
sed -e 's:.*<br>.*::g' ./tmp3.txt | sed -e 's:</blockquote>$::g' > tmp4.txt
sed -e 's:</blockquote>$::g' ./tmp4.txt > tmp5.txt
sed -e 's:^<br>::g' ./tmp5.txt > ../resultat-correct.txt
cd ..
rm -R new

