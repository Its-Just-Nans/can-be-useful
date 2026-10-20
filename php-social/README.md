# trombinouc

A Facebook like social network

---

Pour utiliser ces fichiers :

- Faites appartenir les fichiers à l'utilisateur du site web (`www-data`)
- Mettez les tout en haut de votre site web, il faut avoir les fichiers présents dans l'archive placés le plus haut dans l'arbre du site web.
    Si ce n'est pas le cas, des fonctionnalités peuvent ne pas fonctionner (un menu est généré automatiquement selon l'url).
- Pour le lien à une base de données, il faut modifier le fichier connect.php se situant dans /FonctionSQL/connect.php en mettant les bons identifiants.
- Pour ce qui est de la base de données, deux cas possibles :
    - si vous voulez partir de zéro en créant la base. Allez sur le fichier `/FonctionSQL/base.php` sur un navigateur. Ce fichier contient les commandes de création de la BdD.
    - si vous voulez partir d'une base de données déja fonctionnelle, j'ai exporté ma base avec phpMyAdmin. Il faut alors l'importer sur votre BdD.

Concernant le projet en lui même :
Il faut savoir que la plus grande partie des choses qui ont été écrites et mises en place l'ont été par choix.
En effet, on pourrait par exemple être déconcerté à la vue de tous ces fichiers en désordre. Mais cela a été fait pour être fonctionnel et esthétique (nous n'avons pas une grande arboresence dans l'url, ce que je ne trouve pas très beau/pro, en effet pour des fichiers cela est très pratique mais pour des sites webs, non).

Concernant le cahier des charges :
- On a un mur (cela s'appellera une page pour ce trombinouc, mais il existe aussi le mur, qui regroupe nos publications et celui des amis)
- On a accès aux informations et on peut en changer certaines (page "paramètres").
- On peut créer des publications et y répondre.
- Nous pouvons avoir accès au mail de nos amis.
- Nous pouvons leur souhaiter leur anniversaire car le site nous le rappelle.
- Nous pouvons ajouter et supprimer des amis.
- Il n'y a pas de compte bloqué, l'équivalent d'un compte bloqué est un compte non-ami.
- Les publications contiennent du texte, et un titre (pour se différencier des autres réseaux sociaux), et même un champ pour insérer un lien vers une image.
- Nous pouvons mettre des réponses aux publications.

- Concernant les fonctionnalités supplémentaires, j'ai fait une version mixée de facebook et twitter (on a un mur (publications de nous et de nos amis) et une page (seulement nos publications))

## Note

Poor usage of PDO oject and SQL queries. No variable bindings: <https://www.php.net/manual/en/pdostatement.execute.php>

> Made in 2021
