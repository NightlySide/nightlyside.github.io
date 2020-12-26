---
title: La Bataille Brestoise
date: 2020-06-15T12:00:00
layout: project
tags: ["python", "IHM", "Qt"]
published: true
image: "../assets/projects/bataille-brestoise/console_serveur.png"
---

Dans le cadre de mes études d'ingénieur à l'[ENSTA Bretagne](https://www.ensta-bretagne.fr), j'ai réalisé à l'aide de mon binôme un projet de fin de cycle en python avec pour objectif d'y intégrer de la programmation orientée objet ainsi que de l'interface homme machine.
"La bataille brestoise" est le projet que nous avons codé sur près de 3 mois. Il s'agit d'un jeu en réseau de bataille navale en temps réel basé sur la rade de Brest ainsi que sur les bâtiments de la Marine Nationale.

> Le projet est disponible sur mon repo (installation et utilisation) : [https://github.com/NightlySide/La-Bataille-Brestoise](https://github.com/NightlySide/La-Bataille-Brestoise)

## Introduction

L'objectif initial du projet était de mettre à profit le cours vu sur la programmation orientée objet ainsi que les bases de l'Interface Homme-Machine (IHM). Cependant, avec mon binôme nous avons souhaité pousser le projet plus loin en y intégrant par exemple une connexion clients-serveur et des machines à état finis pour faire de l'intelligence artificielle.

Nous avons donc décidé de partir sur le développement d'un jeu de bataille navale en temps réel, inspiré de jeux en .io tel que le célèbre [agar.io](https://agar.io), dont les bâtiments sont inspirés de la Marine Nationale.
Dans ce jeu, le but sera d'atteindre le niveau 5 en éliminant les adversaires (IA et joueurs réels) pour obtenir des points d'expérience. Si le joueur décède, il réapparaît avec un bâtiment de niveau inférieur.
Des commandes sont disponibles pour le client et pour le serveur de manière à pouvoir intéragir avec le jeu. De plus une chatbox est mise à disposition des joueurs pour la communication entre les joueurs et la communication des informations sur la partie.

L'équilibrage du jeu est obtenu par deux étapes, la première étant un calcul bète et méchant de dégâts par seconde. Les résultats condensés dans un tableau excel permettent de mettre en avant cet équilibrage. La deuxième étape consiste à tester les réglages en jeu.

![Equilibrage des bâtiments](../assets/projets/bataille-brestoise/balance.png)

Pour ce jeu, on a tout d'abord commencé par la création du serveur.

## Le serveur

Nous souhaitions implémente une structure de serveur autoritaire et de clients simples ([Explication](https://www.gabrielgambetta.com/client-server-game-architecture.html)). Tout en ayant une interface simple et déployable sur un serveur externe en headless.

![Écran de démarrage serveur](../assets/projets/bataille-brestoise/console_serveur.png)

Pour se faire, en utilisant python le choix évident était de se tourner vers la bibliothèque `sockets` pour créer un tunnel TCP entre le client et le serveur.
Cependant son utilisation entraîne un problème. Le tunnel ainsi crée ne fonctionne qu'entre le serveur et un seul client. Or nous souhaitons pouvoir jouer en multijoueurs. Deux solutions sont disponibles :

- Utiliser `sockets` avec `selectors` pour faire du multiplexage des entrées et ainsi avoir plusieurs clients connectés en même temps
- Utiliser la nouvelle bibliothèque `asyncio` apportée par python 3

Nous avons décidé de partir sur la deuxième solution, cette dernière prenant en charge le côté asynchrone du serveur par le biais de deux nouveaux mots clés : _async_ et _await_.

A partir de la on peut commencer à créer un serveur prenant en charge la connexion de multiples clients et en leur associant un identifiant unique.

### Les entités

Le serveur étant autoritaire c'est à lui de gérer les entités, par conséquent de gérer l'intelligence artificielle de ces dernières. Encore une fois plusieurs méthodes sont disponibles, mais celle qui m'a le plus attiré est la machine à états-finis.
Pour les non initiés, la machine à états finis est un automate qui est dirigé par l'état dans lequel il se trouve actuellement. Ci-dessous, je vous présente le diagramme des états régissant l'intelligence artificielle des entités.

![Diagramme des états des entités](../assets/projets/bataille-brestoise/FSM.png)

## Le client

Pour la création du client plusieurs bibliothèques graphiques sont à notre disposition. Je pourrais citer par exemple tkinter, wxPython, pyQt ou même Kivy. Nous avons décider de développer notre interface avec [PyQt5](https://fr.wikipedia.org/wiki/PyQt) en raison de son outil _QtDesigner_ (un outil graphique pour générer des interfaces) et sa documentation très fournie.

Le premier écran est celui de connexion au serveur. Les serveurs enregistrés sont affichés dans une liste et l'utilisateur peut choisir son pseudonyme.

![Écran de connexion client](../assets/projets/bataille-brestoise/start_screen.gif)

Une fois connecté, un identifiant unique lui est attribué par le serveur afin de pouvoir se faire authentifier par le serveur ainsi que les autres clients. Cette étape réalisée, l'interface de jeu peut s'ouvrir, présentant l'aire de jeu, la carte (basée sur la rade de Brest), les entités ainsi que la ChatBox et le Radar.

![Ecran de jeu](../assets/projets/bataille-brestoise/demo_multi.gif)

### Le radar

Le radar est l'un des éléments clés du jeu. Il permet de détecter les ennemis aux alentours et de transmettre la position relative au joueur.
Le fonctionnement est relativement simple : on parcoure les entités présente sur le serveur et on ne garde que celles qui sont à portée par un calcul de distance euclidienne. Ensuite on vérifie que l'entité soit présente sous le faisceau vert (voir image ci-dessous) pour être affichée à l'écran, grâce à du calcul vectoriel.

![Démonstration du Radar](../assets/projets/bataille-brestoise/radar.gif)

### La documentation

Pour ce projet, la rédaction d'une documentation est nécessaire. Pour nous simplifier la tâche, nous avons décider de tout automatiser en utilisant [Sphinx](https://www.sphinx-doc.org).

Cet outil nous permet de générer automatiquement la documentation dans le style de Read-the-Docs en prenant la documentation écrite dans les doc-strings du projet. Nous nous sommes tenu au modèle de Google concernant les doc-strings.

![Documentation sur ReadTheDocs](../assets/images/projets/bataille-brestoise/docs_rtd.png)

Nous avons finalement uploadé la documentation sur ReadTheDocs, elle est disponible à l'adresse : [https://la-bataille-brestoise.readthedocs.io/fr/latest/](https://la-bataille-brestoise.readthedocs.io/fr/latest/)
