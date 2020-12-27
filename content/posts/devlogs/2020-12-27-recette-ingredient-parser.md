---
title: "Scraper de recettes et parser d'ingrédients"
date: 2020-12-27T20:10:00
layout: "post"
tags: ["python", "web", "scraper", "parser", "ingredient", "recette"]
image: "../../assets/posts/devlogs/recipe_schema.jpg"
published: true
---

Si le titre vous rend confus c'est peut être normal. Je vais essayer d'expliquer ce qu'est le scraping et le parsing que j'ai utilisé dans le cadre de mon projet: A Chef in the Fridge v2.

## Motivation

Dans ma précédente itération, les recettes étaient entrées à la main à partir des ingrédients déjà présent dans la base de données. Non seulement cette solution n'était clairement pas intuitive et lente, mais elle est trop peu flexible 🤢.

Pour cette itération je souhaite pouvoir importer automatiquement une recette depuis n'importe quel site le permettant (comme [Marmiton](https://www.marmiton.org/) ou [750g](https://www.750g.com/)). Pour cela j'ai besoin de deux outils :

1. Un scraper pour récupérer les données de la page web de la recette
2. Un parser pour convertir les ingrédients en objets que le serveur pourra comprendre

## Le scraper de recettes

On va commencer par les bases avant d'attaquer le sujet.

### Qu'est-ce qu'un scraper ?

> _"Le web scraping (parfois appelé harvesting) est une technique d'extraction du contenu de sites Web, via un script ou un programme, dans le but de le transformer pour permettre son utilisation dans un autre contexte."_
> -- [Wikipedia](https://fr.wikipedia.org/wiki/Web_scraping)

Autrement dit, un scraper permet de récupérer les informations d'un site comme les objets présents sur la page ou les métadonnées.

Cela se fait très simplement sur Python avec les bibliothèques `requests` (intégrée) et `BeautifulSoup`.

Prenons l'exemple de cette recette sur marmiton concernant un cake au poires et au chocolat: https://www.marmiton.org/recettes/recette_cake-aux-poires-et-chocolat-fondant_38922.aspx. On peut récupérer le contenu de la page à l'aide des lignes suivantes :

```python
import requests
from bs4 import BeautifulSoup

url = "https://www.marmiton.org/recettes/recette_cake-aux-poires-et-chocolat-fondant_38922.aspx"
# On récupère la page avec une requête GET
page = requests.get(url)
# On traite son contenu pour l'utiliser
soup = BeautifulSoup(page.text, "html.parser")

# On récupère le titre de la page
print(soup.find("title").text)
# sortie : 'Cake aux poires et chocolat fondant : Recette de Cake aux poires et chocolat fondant - Marmiton'
```

### Une histoire de méta(données)

Une autre chose intéressante est que les sites de recettes, pour optimiser leur classement sur les moteurs de recherche (voir [Search Engine Optimization](https://www.seo.fr/definition/seo-definition)), utilisent de nombreuses méta-données et il y en a une conçue spécialement pour les recettes.

Le site schema.org décrit la structure des méta-données qui concernent les recettes [ici](https://schema.org/Recipe). Pour commencer ces métadonnées sont présentes dans une balise `<script type="application/ld+json">` contenant un objet JSON décrivant la recette.

Essayons pour voir sur notre lien précédent :

```python
# pour traiter le type de données
import json

recette = None
# on parcoure toutes les balises qui nous intéressent
for balise in soup.find_all("script", type="application/ld+json"):
    data = json.loads(balise.string)
    # on vérifie qu'il s'agisse bien d'une recette
    if data["@type"] == "Recipe":
        recette = data
        break
else:
    print("Aucune métadonnée de recette dans la page")
```

Si on essaye d'afficher le contenu de la variable `recette` on obtient ceci :

```json
{
	"@context": "http://schema.org",
	"@type": "Recipe",
	"name": "Cake aux poires et chocolat fondant",
	"recipeCategory": "autres cakes",
	"image": [
		"https://assets.afcdn.com/recipe/20131123/8075_w1024h1024c1cx2304cy1728.webp",
		"https://assets.afcdn.com/recipe/20131123/8075_w1024h768c1cx2304cy1728.webp",
		"https://assets.afcdn.com/recipe/20131123/8075_w1024h576c1cx2304cy1728.webp",
		"https://assets.afcdn.com/recipe/20131123/8075_w1024h1024c1cx2304cy1728.jpg",
		"https://assets.afcdn.com/recipe/20131123/8075_w1024h768c1cx2304cy1728.jpg",
		"https://assets.afcdn.com/recipe/20131123/8075_w1024h576c1cx2304cy1728.jpg"
	],
	"datePublished": "2006-10-23T11:43:00+02:00",
	"prepTime": "PT10M",
	"cookTime": "PT40M",
	"totalTime": "PT50M",
	"recipeYield": "8 personnes",
	"recipeIngredient": [
		"2 poires",
		"150 g de farine",
		"1 sachets de levure chimique",
		"80 g de sucre",
		"3 oeufs",
		"90 g de beurre fondu",
		"1 cuillères à soupe de cognac",
		"50 g de chocolat (tablette)"
	],
	"recipeInstructions": [
		{
			"@type": "HowToStep",
			"text": "Mélanger : farine, sucre, oeufs, beurre, levure, cognac jusqu'à obtenir une pâte homogène."
		},
		{
			"@type": "HowToStep",
			"text": "Eplucher et couper les poires en dés. Réserver."
		},
		{
			"@type": "HowToStep",
			"text": "Casser le chocolat en carrés."
		},
		{
			"@type": "HowToStep",
			"text": "Dans un moule à cake beurré, verser la moitié de la pâte, au fond puis, disposer les dés de poire. Et placer, dessus, les dés de chocolat. Recouvrir, avec l'autre moitié de pâte."
		},
		{
			"@type": "HowToStep",
			"text": "Enfourner dans un four chaud, à 180° (thermostat 6/7), pendant 40 à 45 min."
		}
	],
	"author": "emma_14273358",
	"description": "poire, farine, levure chimique, sucre, oeuf, beurre, cognac, chocolat",
	"keywords": "Cake aux poires et chocolat fondant, autres cakes, poire, farine, levure chimique, sucre, oeuf, beurre, cognac, chocolat,très facile,bon marché",
	"recipeCuisine": "",
	"aggregateRating": {
		"@type": "AggregateRating",
		"reviewCount": 53,
		"ratingValue": 4.6,
		"worstRating": 0,
		"bestRating": 5
	}
}
```

On peut maintenant récupérer les ingrédients, le temps de préparation, le nombre de personnes, les notes et les étapes de préparation de la recette et tout cela en ne cherchant que dans l'en-tête de la page !

![What a time to be alive](https://media.giphy.com/media/u99fFT1YBzyco/giphy.gif)

Mais nouveau problème 😢 comment faire pour que le serveur comprenne "150 g de farine" ou "1 cuillères à soupe de cognac" ?

Réponse : le parser à la rescousse !

## Le parser d'ingrédients

Rebelote on commence par les bases pour ne pas se perdre.

### Qu'est-ce qu'un parser ?

Je vous épargne la définition wikipédia cette fois-ci. Pour essayer de faire simple, un parser est un programme qui va prendre un texte et le transformer d'abord en `TOKEN` (jetons en français) puis il peut passer ces jetons à un Lexer qui va ensuite chercher le lien entre ces jetons pour agir en conséquence.

L'exemple le plus connu pour les parser est la programmation. En effet lorsqu'un code source est donné à un compilateur, il va d'abord le découper en jetons, puis à l'aide d'un arbre il va retracer le lien entre ces jetons en vérifiant que rien n'est manquant (coucou le ";") puis effectuer des optimisations avant de le traduire en code machine.

### A quoi sert un parser dans ce projet

Ici on va faire quelque chose de similaire mais sans passer par un lexer. On souhaite juste pouvoir récupérer les différents jetons qui nous intéressent. Prenons par exemple l'ingrédient "150g de farine"

![Ingrédient : 150g de farine](../../assets/posts/devlogs/regex_ingredient.jpg)

Ce que je souhaite c'est que le programme puisse d'abord comprendre cet ingrédient sous la forme :

```
{quantité} {unité} {ingrédient}
```

Puis me sortir un objet, pourquoi pas du JSON, de la forme :

```json
{
	"ingredient": "farine",
	"quantity": [
		{
			"unit": "gramme",
			"amount": 150
		}
	]
}
```

Ainsi je pourrais le réutiliser sans soucis dans le serveur et dans l'application.

### Implémentation

Pour cela je vais me baser sur le travail magnifique (mais en anglais) du groupe OpenCulinary et de leur [parser d'ingrédient](https://github.com/openculinary/ingredient-parser).

Pour cela je vais utiliser la bilbiothèque `parsimonious` qui permet de définir une grammaire et qui retourne non seulement un arbre des différents TOKEN trouvés mais permet de définir des fonctions de passage qui retourneront l'objet en question.

Je passe sur la grammaire utilisée. Vous pouvez la retrouver dans un fichier texte disponible [ici](../../assets/posts/devlogs/ing-parser-grammar.txt).

Cette grammaire supporte les unités métriques, anglaises (lbs, tbsp, ...) et françaises (goutte, larme, sachet, branche, etc...).

Il suffit de définir une classe qui hérite de `NodeVistor` avec les fonctions en fonction des différent matchs. En effet, la transformation en jetons se base sur des règles d'expressions régulières.

```python
from parsimonious.grammar import Grammar
from parsimonious.nodes import NodeVisitor

class IngredientParser(NodeVisitor):
    grammar = Grammar(...)

    # exemple de fonction de visite d'un noeud
    def visit_multipart_quantity(self, node, visited_children):
        results = []
        for child in visited_children:
            unit, system, amount = child
            if results and not results[0]['unit']:
                amount *= results[0]['amount']
                results = []
            results.append({
                'unit': unit,
                'unit_type': system,
                'amount': amount
            })
        return results
```

Avec ce code on arrive bien à transformer une ligne d'ingrédient en un objet réutilisable par le système. Victoire 🥳 !

## Conclusion

_Je vais probablement mettre le code complet sur GitHub pour conserver une trace._

C'est un premier pas vers la conception du backend de mon application. Je suis maintenant capable de scraper les sites de recettes pour récupérer leurs métadonnées et les transformer en recette.

Je suis aussi capable de traiter les lignes d'ingrédients (ce qui me posait le plus de problèmes) cependant cette découpe n'est pas parfaite. En effet il ne fait pas (encore) la différence entre un ingrédient et la façon dont il est préparé (par exemple : "_2 bottes de basilic frais_" donne pour ingrédient "_basilic frais_" au lieu de "_basilic_").

Les programmes ne sont jamais parfait il reste toujours quelque chose à améliorer. Pour moi cela me semble (enfin) satisfaisant pour cette itération.
