---
title: "[TIPE] Un problème de route - Passage en 2D (3/4)"
date: 2017-12-02T12:00:00
layout: post
tags: ["python", "TIPE", "route"]
published: true
image: "../../assets/posts/TIPE/random_front.jpg"
---

La deuxième étape consiste à passer la simulation à deux dimensions en vue d'implémenter les déviations et intersections. On peut encore séparer cette étape en plusieurs sous-étapes : création d'une grille qui va accueillir la route, à la manière d'un plateau contenant des cartes ou des jetons, puis création de la route et finalement adaptation des véhicules au nouveau système de route en 2 dimensions.

## Création de la grille

A quoi devra ressembler la grille ? Pour répondre à cette question on pose les conditions de déroulement de la simulation :

- la grille devra contenir **W** cases en largeur et **H** cases en hauteur
- la simulation comportera **T** itérations

Alors la grille sera représentée par un tableau à 3 dimensions de taille $T\times H\times W$ alors $\text{grille}[t]$ retournera l'état de la grille à l'instant $t$.

```python
def grille_random(w, h, t):
    """
    Crée une grille de façon analogue à grille(w, h, t)
    Et préremplie la grille avec des valeurs aléatoires
    Retourne un tableau de dimension 3 (x, y, t)
    """
    return [[[randrange(0, 4) for i in range(h)] for j in range(h)] for k in range(t)]
```

Avec le système actuel d'exportation de tableau qui consiste à attribuer une couleur par case (0 pour blanc, 1 pour vert et 2 pour orange pale) avec chaque couleur associée à un élément de la simulation (respectivement vide, route et véhicule). Le code ci-dessus retournera une grille de la bonne taille. Le remplissage étant aléatoire pour mettre en évidence la structure de la grille, un exemple est le suivant :

![Grille aléatoire](../../assets/posts/TIPE/random.jpg)

## Création de la route

On entame dès à présent une des parties des plus compliquées avec la création de la route. On définit la route comme étant l'ensemble des positions prises par un chemin pour aller d'un point _A_ à un point _B_.

![AtoB](../../assets/posts/TIPE/AtoB.jpg)

En prenant les coordonnées de $A = (0,0)$ et $B = (2,2)$ alors le chemin correspondant sera :

```python
chemin = [(0, 0), (0, 1), (0, 2), (1, 2), (2, 2)]
```

### Algorithme

Pour créer la route on initialise un tableau contenant les positions de chaque case. On commence par la case du début puis on choisis la prochaine de façon relativement simple, on sera probablement amené qu'à créer des droites ou des angles droits, il n'est donc pas nécessaire de se compliquer la tâche. Une fois qu'on est arrivée à la dernière case on retourne la liste crée.

```python
def chemin(pos1, pos2):
  """
  Permet de créer un chemin entre deux coordonnées pos1, et pos2
  Prends en argument 2 positions (x, y)
  Retourne une liste de positions correspondant au chemin crée
  """
  x1, y1 = pos1
  x2, y2 = pos2
  c = [pos1]
  pos = pos1
  while pos != pos2:
      x, y = pos
      if x > x2:
          x -= 1
      elif x < x2:
          x += 1
      else:
          if y > y2:
              y -= 1
          elif y < y2:
              y += 1
      pos = (x, y)
      c.append(pos)
  return c
```

A partir de cet algorithme on peut maintenant créer une nouvelle fonction qui prendra une liste de positions par lesquelles le chemin devra passer et qui retournera un tel chemin. Comme on suppose le tracé global simple, on segmente le chemin en traçant la route entre 2 positions à chaque fois.

```python
def chemin_complexe(*positions):
    """
    Permet de créer un chemin complexe, c'est à dire
    un chemin qui passe par n positions
    Retourne le chemin passant par les positions
    """
    c = []
    for k in range(len(positions)-1):
        cprime = chemin(positions[k], positions[k+1])
        c = c + [cprime]
    return c
```

> A noter qu'écrire `*positions` permet de donner autant d'argument à la fonction qu'on le souhaite

Par exemple écrire le code ci-dessous :

```python
route = chemin_complexe((1, 1),
                        (1, 48), (10, 48), (10, 3),
                        (20, 3), (20, 48), (30, 48),
                        (30, 3), (40, 3), (40, 48),
                        (48, 48), (48, 1), (2, 1))
```

Correspondra à la grille suivante :

![chemin_sur_route](../../assets/posts/TIPE/chemin_sur_route.jpg)

## Faire avancer les voitures

Maintenant qu'on a la grille ainsi que la route qui la parcourt, il est temps de faire avancer les voiture. Pour cela on réutilise le même principe que celui vu dans le post précédent. Cependant un problème nous fait face, en effet comment savoir quelle sera la prochaine case que l'algorithme devra explorer ?

### Recherche des voisins possibles

Une solution est de chercher toutes les cases qui juxtapose une position donnée (i.e. qui sont juste à côté de la case), on teste chacune des cases pour savoir si il s'agit bien d'une route. Si oui on l'ajoute à la liste des voisins possible, sinon on passe à la suivante. Une fois qu'on a testé toutes les cases on retourne la liste des cases possibles.

```python
def cherche_voisins(chemin, pos):
    """
    Permet de renvoyer les voisins possibles juxtaposant
    la position actuelle
    Retourne une liste de positions
    """
    y, x = pos
    voisins = []

    for k in range(-1, 2):
        if k!=0 and (y, x+k) in chemin:
            voisins.append((y, x+k))
        if k!=0 and (y+k, x) in chemin:
            voisins.append((y+k, x))
    return voisins
```

Pour choisir la case suivante on liste celle possible, on cherche la case la plus proche de celle à atteindre. Dans le cas où on a une déviation, l'algorithme choisira le chemin le plus court "à vol d'oiseau". Ce qui à l'air au premier abord de ressembler à la réalité. Enfin.. c'est logique quoi :)

```python
def voisin_plus_proche(pos, voisins):
    """
    Retourne le voisin le plus proche d'une position donnée
    Cela permet de décider dans quelle direction aller pour
    atteindre un point donné
    Retourne une position
    """
    assert len(voisins) != 0
    x, y = pos
    dmin = float("inf")
    vproche = voisins[0]
    for voisin in voisins:
        distance = ((x-voisin[0])**2+(y-voisin[1])**2)**(1/2)
        if distance < dmin:
            dmin = distance
            vproche = voisin
    return vproche
```

### Nouveau calcul de la distance

L'algorithme du post précédent avait besoin de connaître la distance de la voiture à celle qui lui précédait pour la phase de décélération. Maintenant on ne peux plus juste calculer la distance cartésienne entre les deux points à cause de la forme de la route. Pour la calculer il suffit de partir de la position de la voiture et de remonter le chemin jusqu'à rencontrer la voiture suivante.

```python
def distance(pos1, pos2, chemin):
    """
    Essayer de calculer la distance entre 2 cases d'une grille
    en suivant un chemin donné
    Retourne un entier correspondant à la longueur du chemin à faire
    entre le point pos1 et pos2
    """
    # On vérifie que les positions appartiennent au chemin
    assert pos1 in route and pos2 in chemin
    pos = pos1
    d = 0
    while pos != pos2:
        voisins = cherche_voisins(chemin, pos)
        pos = voisin_plus_proche(pos, voisins)
        d += 1
    return d
```

### Déplacer la voiture

Maintenant qu'on a calculé tout ce qu'il fallait, il ne reste plus qu'à déplacer la voiture le long du chemin à l'aide de tout ce qu'on a définit plus haut. Pour cela on part de la position initiale (_pos_) puis on parcourt le chemin d'un nombre de cases égal à la vitesse de la voiture (_vitesse_) si il y avait déjà une voiture, par sécurité on s'arrête, sinon on continue jusqu'à ce qu'on ait terminé.

```python
def avance(t, pos_i, vitesse, chemin, grille):
    """
    Calcule la prochaine position d'une voiture sur un chemin
    en fonction de sa vitesse et de la voiture précédente
    Si la voiture devant est à l'arret la voiture actuelle
    s'arrêtera juste avant
    Retourne une position ainsi que le nombre de case parcourues
    """
    pos = [pos_i]
    dt = 0
    while dt < vitesse:
        nouvelle_pos = voisin_suivant(route, pos[-1])
        i, j = nouvelle_pos
        if grille[t][i][j] == 2:
            return (pos[-1], dt)
        pos.append(nouvelle_pos)
        dt += 1
    return (pos[-1], dt)
```

## Résultat

On réapplique le même procédé que pour la situation linéaire. On prends sur la route du dessus 100 voitures roulant à 130 km/h maximum et on calcule la simulation sur 250 itérations. On calcule chaque itération puis on exporte la grille à chaque instant. En assemblant les images dans un GIF animé, on obtient l'animation suivante :

![sim_2D_anim](../../assets/posts/TIPE/sim_2D_anim.gif)
