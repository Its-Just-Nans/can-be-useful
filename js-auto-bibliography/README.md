# js-auto-bibliography

You are writing a PhD/master thesis but forgot to create a clean bibligraphy using <https://api.crossref.org>.

Create your source file with one source per lin

```txt
(J.), « La réparation de la nature et quelques-uns de ses enjeux du  de vue de l'évaluation des atteintes écologiques », *Revue  de l'environnement*, vol. 42, n°4, 2017, pp. 629-636.
... add more lines
```

```sh
node search.js
```

```bib
@article{Hay_2017, title={La réparation de la nature et quelques-uns de ses enjeux du point de vue de l’évaluation des atteintes écologiques}, volume={42}, ISSN={0397-0299}, url={http://dx.doi.org/10.3406/rjenv.2017.7162}, DOI={10.3406/rjenv.2017.7162}, number={4}, journal={Revue Juridique de l’Environnement}, publisher={PERSEE Program}, author={Hay, Julien}, year={2017}, pages={629–636} }
```
