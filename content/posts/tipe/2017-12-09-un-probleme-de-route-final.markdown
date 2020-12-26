---
title: "[TIPE] Un problème de route - Le final (4/4)"
date: 2017-12-09T12:00:00
layout: post
tags: ["python", "TIPE", "route"]
published: true
image: "../../assets/posts/TIPE/final_front.jpg"
---

Dernière ligne droite pour le modèle informatique. La dernière étape consiste à implémenter les carrefours, les déviations et les intersections. On se place toujours dans les hypothèses mises en place dans l’explication de la démarche. Mais leur implémentation n’est pas facile à se représenter. Durant la phase de développement, on a fait face à de nombreux problèmes, voici comment on les a résolu.

## Réécriture des représentations des voitures, chemins et de la grille

L’ancienne représentation (à l’aide de tableau) n’est probablement pas la meilleure solution à considérer pour la compréhension et la lisibilité de l’algorithme. Pour cela on utilisera les classes (notion hors programme de PSI en CPGE), pour plus d’information [ce cours publié sur OpenClassroom](https://openclassrooms.com/courses/apprenez-a-programmer-en-python/premiere-approche-des-classes) explique mieux ce concept que je ne pourrais le faire.

### Les voitures

Une des raisons pour lesquelles nous allons utiliser les classes est que cela facilite la compréhension. En effet pour récupérer la vitesse d’une voiture avant il fallait récupérer une entrée d’un tableau correspondant à ladite voiture. En utilisant les classes on utilise maintenant la méthode `voiture.getPosition(t)`. Ainsi, on crée chaque voiture en lui donnant le nombre d’itérations que la simulation va calculer afin de stocker toutes les positions et vitesses pour les analyser. On lui donne le chemin sur lequel elle va évoluer ainsi que sa position initiale et la vitesse maximale à laquelle et pourra circuler. Le reste sera géré par la simulation.

```python
class Voiture:
    def __init__(self, nbTemps, chemin, carte, position, vmax, facteur):
        # On définit les attributs de la voiture

    def setPosition(self, t, position)
    def getPosition(self, t)
    def getVitesse(self, t)
    def maj_vitesse(self, t):
        # On adapte ici le code de la simulation précédente
```

### La carte et ses routes

De même on retranscrit le code précédent en quelque chose de plus exploitable. En effet, il est plus simple d’écrire `carte.placerVoiture(t, voiture)` pour modifier la carte en ajoutant une voiture à l’instant _t_.

```python
class Carte:
    def __init__(self, hauteur, largeur, nbTemps, aleatoire):
        # On définit les attributs de la carte

    def elementALaPosition(self, t, position):
        # Retourne l'élément de la carte se trouvant à une certaine position
    def creerGrille(self, hauteur, largeur, nbTemps, aleatoire)
        # Permet d'initialiser la grille pour la simulation
    def represente(self, t, taille):
        # Retourne une représentation de la carte à l'instant t
        # Et ce, taille fois plus grand
    def placerVoiture(self, t, voiture)
    def placerRoute(self, route)
```

De même pour les routes :

```python
class Chemin:
    def __init__(self, carte, *positions):
        # On initialise la route à partir des positions par lesquelles
        # elle passera

    def creerCheminSimple(self, pos_i, pos_f):
        # Permet de créer un chemin simple entre 2 points
    def creerCheminComplexe(self, *positions):
        # Permet de créer un chemin complexe passant par un ensemble de positions
    def additionneChemins(self, c):
        # Permet d'additionner le chemin c à l'actuel
    def estSurChemin(self, pos):
        # Vérifie si une position se trouve sur le chemin
    def voisins(self, position)
    def voisin_suivant(self, position)
    def distance(self, pos1, pos2):
        # Retourner la distance en nombre de cases entre les deux positions
```

## Le problème de l'ancienne simulation

L’ancienne simulation fonctionnait bien lorsqu’il n’y avait qu’une seule voiture sur la route. Cependant, la voiture, face à une bifurcation va choisir aléatoirement une route ou l’autre. Nous l’avions codé de cette manière, mais nous voulons que la circulation ne se fasse que dans un sens pour pouvoir analyser la vitesse et la densité des voitures.

![Problème](../../assets/posts/TIPE/probleme.gif)

Pour résoudre ce problème, une solution (celle que j’ai choisi), est de numéroter chaque case de la route, ainsi le sens de circulation sera donné par des indices de case croissants. C’est à dire que le chemin du post précédent devient maintenant :

```python
chemin = [[0, (0, 0)],
          [1, (0, 1)],
          [2, (0, 2)],
          [3, (1, 2)],
          [4, (2, 2)]]
```

## Utilisation du nouveau code

### Quelques procédures et fonctions bien utiles

Depuis le début de ces posts, je vous ai présenté des images, du texte, correspondant au résultats des simulations mais je ne vous ai pas encore expliqué comment cela se fait. Voici quelques fonctions bien utiles que j’ai utilisé entre autre afin d’exporter la carte à un instant donné, comment j’ai transformé une vitesse en cases par unité de temps en km/h, etc.

La fonction suivante permet de récupérer une distance cartésienne entre deux points (il s’agit de la norme de la distance à ces points).

```python
def distancePos(pos_i, pos_f):
    x, y = pos_i
    i, j = pos_f
    return ((x - i)**2 + (y - j)**2)**(1/2)
```

Voici une autre fonction très utile que je traîne avec moi depuis quelques années et qui me sert pour numéroter des images d’une simulation afin qu’elles soient acceptée par certains logiciels. Elle permet entre autre de transformer `98` et `6` en `00098` et `00006`.

```python
def ajoutezeros(n, nombrezeros):
    """
    Prends le nombre n et rajoute le nombre de zéros nécessaires
    à sa représentation en chaine de charactère
    Retourne une chaine de charactères
    ex : on veut un nombre à 3 chiffres : ajoutezeros(3, 5) = "003"
    """
    nb = nombrezeros-len(str(n))
    if nb >= 0:
        return "0"*nb+str(n)
    return str(n)
```

Le code suivant permet d’afficher la carte à l’instant t. J’ai décidé de laisser tomber matplotlib pour pylab qui à l’avantage de supporter un rafraîchissement de l’image plus fréquent (et par conséquent le support des animations).

```python
def affiche_grille(carte, t):
    pylab.ion()
    tabplot = pylab.imshow(carte.represente(t, taille=10), \
                    cmap=matplotlib.colors.ListedColormap(['white', 'palegreen', 'antiquewhite']))
```

Voici une des plus grandes avancées de mon code depuis la première version (en linéaire) il sert à jouer l’animation sans pour autant l’exporter en fichiers. Cela reste plutôt lent et le paramètre qui permet de contrôle le nombre d’images par secondes (FPS en anglais) est homéopathique.

```python
def affiche_simulation(carte, fps=25, tmin=0, tmax=nbTemps):
    pylab.ion()
    tabplot = pylab.imshow(carte.represente(0, taille=10), \
        cmap=matplotlib.colors.ListedColormap(['white', 'palegreen', 'antiquewhite']))
    for t in range(tmin, tmax):
        tabplot.set_data(carte.represente(t, taille=10))
        pylab.draw()
        xx = pylab.waitforbuttonpress(timeout=1/fps)
```

### Création de la simulation

Le code précédent s’est bien raccourci grâce aux classes et possède une certaine compréhension quand à son initialisation.

```python
# on crée la carte
carte = Carte(W, H, nbTemps)
# on crée la route
route = Chemin(carte, (74, 0), (74, 54), (0, 54))
# on crée la seconde route
route2 = Chemin(carte, (74, 45), (54, 45), (54, 29), (6, 29), (6, 54))
# on indique l'endroit où les routes vont se rejoindre
route.deviation(route2, (6, 54))
# On place la route
carte.placerChemin(route)
```

On a ainsi crée la carte sur laquelle la simulation va se dérouler, crée la route principale avec une déviation. Maintenant on doit crée les voitures. Pour se faire rien de plus simple on utilise la classe du dessus pour crée autant d’instances que de voitures. On utilise le code suivant, notez bien la structure particulière qui est presque transparente.

```python
voitures = []
for _ in range(nbVoitures):
    voiture = Voiture(nbTemps, route, carte, vitessemax=3, p=random())
    voitures.append(voiture)
    # On place la voiture
    voiture.setPosition(t=0, position)
    carte.placerVoiture(t=0, voiture)
```

On vient de créer toutes les voitures et on les a placées à leur première position c’est à dire pour à $t=0$. Il ne reste plus qu’à calculer la vitesse de chaque voiture pour chaque temps et les déplacer en conséquence. On commence à $t=1$ puisque la situation initiale à déjà été définie.

```python
for t in range(1, nbTemps):
    # Pour chacune des voitures
    for k in range(len(voitures)):
        # On fait avancer les voitures et on change leur vitesse
        voitures[k].setPosition(t, voitures[k].avance(t, voitures[k].getPosition(t-1), voitures[k].vitesse[t-1])[0])
        voitures[k].maj_vitesse(t)
        # On replace la voiture sur la grille de l'instant t
        carte.placerVoiture(t, voitures[k])
```

## L'animation finale

Ça y est ! On touche à la fin. Normalement tout fonctionne maintenant et on se retrouve avec une carte contenant la position de toutes les voitures à tout instant de la simulation. Il ne reste plus qu’à traiter ce tableau afin d’afficher la simulation. On obtient finalement quelque chose qui ressemble à l’animation ci-dessous.

![Problème](../../assets/posts/TIPE/anim_finale.gif)

Le modèle informatique est dès à présent terminé. La prochaine étape consiste à construire une maquette modélisant la circulation et de tout comparer à la réalité.
