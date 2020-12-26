---
title: "[BTC] Nombre heureux - WriteUp"
date: 2020-01-01T12:00:00
layout: post
tags: ["writeup", "break-the-code", "challenge", "CTF"]
published: true
image: "../../assets/posts/BTC/annuaire.jpg"
---

En fouillant dans la clé USB, vous tombez sur un dossier contenant un morceau d'annuaire téléphonique, et un fichier contenant des instructions.

*"Depuis quelques mois, un de mes collègues me harcèle et j'ai peur qu'il finisse par me faire du mal. Des fois qu'il tomberait sur ce document, je préfère ne pas le citer directement ..."*

*Aidez la police en trouvant l'identité de la personne dont M. X parle.*

> Le Challenge Break the Code est une compétition du type Capture The Flag (CTF) organisée par [Sopra Steria](https://www.soprasteria.com/fr) qui dure 1h30. Les équipes des grandes écoles du bassin brestois s’y affrontent sur des challenges informatiques. Ces challenges mélangent différentes compétences telles que la programmation, l’analyse de donnée et la culture du numérique.

## Première Analyse

Nombre heureux est la 7ème épreuve de ce CTF, le but étant de trouver un numéro de téléphone présent dans l'annuaire de l'exercice.

> Si vous voulez essayer par vous-même, les fichiers de cet exercice sont disponibles [ici](/files/BTC/nombre-heureux.zip).

Pour retrouver ce numéro l'exercice nous donne des instructions, il s'agit de la somme des nombres qui remplissent les conditions suivantes :

- être compris entre 0 et 200 000 **inclus**
- être heureux
- être impair
- être premier

Comme Break The Code est une compétition de rapidité, pour le prototypage de l'algorithme j'ai décidé de choisir python.

## Conception de l'algorithme

### Nombre heureux

L'exercice nous définit un nombre heureux de la sorte :
Partant de n'importe quel entier positif, remplacer cet entier par la somme des carrés des chiffres qui le composent, et répéter le processus jusqu'à ce que le nombre soit égal à 1 (auquel cas le nombre est qualifié de "heureux"). Si le processus boucle (i.e. on repasse sur un nombre déja obtenu lors d'une étape précédente), alors le chiffre n'est pas "heureux" et le processus peut être stoppé.

Un algorithme naïf est une fonction récursive permettant de déterminer si le nombre est heureux ou non :

```python
def heureux(k):
    # Si on entre dans une boucle
    # Le nombre n'est pas heureux
    if k in [4, 16, 37, 58, 89, 145, 42, 20]:
        return False
    if k == 1:
        return True
    s_k = str(k)
    s=0
    # Calcul de la somme des carrés des chiffres de k
    for l in s_k:
       s += int(l)**2
    # On réitère
    return heureux(s)
```

> La méthode que je recommande dans ce genre de cas (pour des calculs "classiques") est de chercher un algorithme préfait sur internet.
> Par exemple [celui-ci](http://www.developpement-informatique.com/article/98/exercices-corriges-python-serie-9) fera très bien l'affaire et pourra vous faire gagner 10-15 minutes sur l'exercice.

### Nombre impair et premier

En python la syntaxe pour vérifier si un nombre est impair est très simple :

```python
def impair(x):
    return x%2!=0
```

Pour savoir si il est premier, le plus rapide sera de chercher un algorithme préfait sur internet. Dans le contexte de cet exercice j'ai utilisé [celui-ci](https://stackoverflow.com/a/27946768).

```python
from itertools import count, islice
def premier(n):
    return n > 1 and all(n%i for i in islice(count(2), int(sqrt(n)-1)))
```

### Ecriture de la boucle

Il ne reste plus qu'à itérer sur chaque nombre et de calculer la somme :

```python
if __name__ == "__main__":
    somme = 0
    # Pour tous les nombres de 1 à 200 000 inclus
    # 0 n'étant pas impair
    for n in range(1, 200001):
        if heureux(n) and impair(n) and premier(n):
            somme += n

    print(f"Le numéro de téléphone est : {somme}")
```

On récupère finalement en sortie de notre algorithme : _Le numéro de téléphone est : 254445710_.

La toute dernière étape est de vérifier que le numéro est bien présent dans l'annuaire.
Il est effectivement présent et il s'agit de **Michael Scarn** qui représente le flag (drapeau) de cet exercice.

## Conclusion

Ce challenge est relativement simple, il s'agit plus d'une épreuve de programmation que d'une enquête digne d'un CTF.
Cependant il peut s'avérer être un véritable challenge si on souhaite recoder "à la main" chaque fonction utilisée dans cet exercice.
Internet à été inventé dans le but de partager les connaissances. Si les CTF tels que Break The Code autorisent son utilisation durant le challenge c'est bien pour que l'on s'en serve !

PS: vous retrouverez le script python complet [ici](../../assets/posts/BTC/nombre-heureux.py).
