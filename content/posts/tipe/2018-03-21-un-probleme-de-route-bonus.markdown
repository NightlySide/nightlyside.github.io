---
title: "[TIPE] Un problème de route - Bonus"
date: 2018-03-21T12:00:00
layout: post
tags: ["python", "TIPE", "route"]
published: true
image: "../../assets/posts/TIPE/sim_vitesse_front.jpg"
---

Un petit bonus pour ce projet. Je cherche maintenant à représenter la vitesse de chaque véhicule afin d’avoir une idée plus précise sur la fluidité du trafic routier. Il y a certes peu de modifications à faire, mais cela en vaut le coup.

## Pourquoi une telle représentation

L’idée m’est venue en lisant des articles sur la représentation de Nagel-Schreckenberg. Après avoir flâné quelques temps sur Wikipédia, j’ai décidé de changer la langue de la page afin de voir si d’autres contributeurs non francophones avaient étoffés leur page plus que ça n’est le cas sur celle française.

A ma grande surprise, la [page allemande du model de Nagel Schreckenberg](https://de.wikipedia.org/wiki/Nagel-Schreckenberg-Modell) montre une représentation du modèle plutôt ingénieuse : donner une couleur par véhicule en fonction de la vitesse de circulation de celui-ci. (voir figure ci-dessous)

![Représentation](../../assets/posts/TIPE/NaSch.png)

Maintenant on va modifier le code source de notre étude afin d’y implémenter cette nouvelle fonctionnalité.

## Implémentation

La première étape est de modifier la fonction qui place les véhicules. En effet, précédemment, pour placer une voiture sur la carte, la simulation ajoutait un \*2 sur la case correspondante.

Maintenant nous allons remplacer la fonction placerVoiture de la classe Carte par le bout de code suivant :

```python
def placerVoiture(self, t, voiture):
    i, j = voiture.getPosition(t)
    self.grille[t][i][j] = 2 + voiture.getVitesse(t)
```

La seule grande différence est que l’on calcule la valeur de la case par `2 + vitesse de la voiture`.

Cela nous amène à notre seconde modification, en effet, pour détecter la présence d’une voiture, on récupérait la valeur d’une case de la carte que l’on comparait à 2. On remplace alors toutes les occurrences par $\geq 2$ ce qui permettra de détecter la présence d’une voiture quelque soit sa vitesse.

## Affichage

On a maintenant l’ajout des vitesses des voitures sur la carte, il est grand temps de les afficher ! Pour cela on change légèrement la liste des couleurs de matplotlib.pyplot par :

```python
['white', 'palegreen', 'antiquewhite', 'yellow', 'orange', 'orangered', 'firebrick', 'darkred', 'black']
```

Ainsi une voiture à l’arrêt sera de couleur jaune et tendra vers le rouge en accélérant, puis sera noire à vitesse maximale. Le seul problème avec matplotlib est que si il n’y a pas au moins une occurrence de chaque couleur, il n’affichera pas correctement la couleur de la route et des véhicules. On ajoute alors à la représentation de la carte une unique ligne de pixels contenant toutes les valeurs de la vitesse afin quelles soient toutes représentées :

```python
tableau = tableau + [ [k for k in range(0, 2+int(vmax)+1)] + [0 for k in range(len(tableau[0]) - (2+int(vmax)+1))] ]
```

C’est tout ce qu’il y avait à faire !! (oui j’ai passé près de 2 heures sur ces modifications) Le résultat est vraiment satisfaisant par contre.

![Vitesses](../../assets/posts/TIPE/sim_vitesse.png)
