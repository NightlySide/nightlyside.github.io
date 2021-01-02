---
title: "Composition des ingrédients avec les données Ciqual"
date: 2021-01-02T11:54:00
layout: "post"
tags: ["python", "sql", "xml", "data"]
image: "../../assets/posts/devlogs/ciqual.jpg"
published: true
---

Dans ma précédente itération du projet "_A Chef in the Fridge_" l'utilisateur devait rentrer manuellement le nom et le type des ingrédients que sa recette utilise. Alors non seulement cela était très lourd pour l'utilisateur, surtout en ce qui concerne la recherche des informations sur la composition des ingrédients.

Nous allons voir comment automatiser tout ça dans ce post.

## Le jeu de données Ciqual

Pour commencer il nous faut une **source de données** à partir de laquelle on va baser toute notre optimisation. En cherchant sur le site [data.gouv.fr](https://www.data.gouv.fr/fr/) je suis tombé sur la "[Table de composition nutritionnelle des aliments Ciqual](https://www.data.gouv.fr/fr/datasets/table-de-composition-nutritionnelle-des-aliments-ciqual/)".

Qu'est-ce que **Ciqual** ? Il s'agit d'une table recensant près de 2800 aliments, crée par l'[ANSES](https://www.anses.fr/fr) (Agence Nationale de SÉcurité Sanitaire, alimentation, environnement, travail). On peut retrouver dans cette tables des aliments ainsi que leur composition. Et tout ça en source ouverte !

Les données fournies par Ciqual se décompose en 5 fichiers :

-   `alim_2020_07_07.xml` : données des aliments
-   `alim_grp_2020_07_07.xml` : données des groupes alimentaires
-   `const_2020_07_07.xml` : constantes pour la composition (glucides, énergie, ...)
-   `compo_2020_07_07.xml` : données de la composition des aliments
-   `sources_2020_07_07.xml` : sources des données de composition de chaque aliment

Pour comprendre comment sont stockées ces données, Ciqual met à disposition [une documentation](https://ciqual.anses.fr/cms/sites/default/files/inline-files/Table%20Ciqual%202020_doc_XML_FR_2020%2007%2007.pdf) plutôt détaillée.

## Format des données

Avant de pouvoir utiliser ces données il est intéressant de jeter un oeil à la façon dont elles sont enregistrées.

Par exemple un aliment ressemble à la structure suivante :

```xml
<ALIM>
  <alim_code> 2016 </alim_code>
  <alim_nom_fr> Jus de raisin, pur jus </alim_nom_fr>
  <ALIM_NOM_INDEX_FR> Jus de raisin </ALIM_NOM_INDEX_FR>
  <alim_nom_eng> Grape juice, pure juice </alim_nom_eng>
  <alim_grp_code> 06 </alim_grp_code>
  <alim_ssgrp_code> 0602 </alim_ssgrp_code>
  <alim_ssssgrp_code> 060201 </alim_ssssgrp_code>
</ALIM>
```

Une composition d'une constante pour un ingrédient donné ressemble à la structure suivante :

```xml
<COMPO>
  <alim_code> 1003 </alim_code>
  <const_code> 333 </const_code>
  <teneur> 328 </teneur>
  <min missing=" " />
  <max missing=" " />
  <code_confiance> C </code_confiance>
  <source_code> 147 </source_code>
</COMPO>
```

Il est évident que l'on ne peut pas utiliser les données telles quelles. De plus essayer de charger complètement les 2800 aliments avec une vingtaine de compositions différentes devient très lourd en mémoire (près de 800Mo de RAM utilisée pour un programme rédigé avec Python).

La solution pour résoudre ces deux problèmes ? Une **base de données relationnelle**. On va donc ici aussi utiliser une base de données spécifiquement pour les ingrédients.

## La base de données

### Création de la bdd

Pour cette base de données je vais utiliser une fois de plus **SQLite** avec pour ORM [SQLAlchemy](https://www.sqlalchemy.org/).

> Pour rappel un ORM est : "un type de programme informatique qui se place en interface entre un programme applicatif et une base de données relationnelle pour simuler une base de données orientée objet" -- [Wikipedia](https://fr.wikipedia.org/wiki/Mapping_objet-relationnel)

![SQLAlchemy logo](../../assets/posts/devlogs/sqlalchemy.png)

On peut alors avec python créer une base de données (fichier `data.db`) et l'initialiser simplement avec le code suivant :

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# création du moteur, ici on utilise SQLite
engine = create_engine('sqlite:///data.db', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    # on va importer tous les modèles
    # pour que SQLAlchemy puisse créer toutes les tables
    # et se connecter aux données
    import ...
    Base.metadata.create_all(bind=engine)
```

Vous avez peut être remarqué que j'ai laissé l'import vide et c'est normal. Je dois d'abord créer le modèle correspondant aux données.

### Création des modèles

On a 4 modèles à créer et je vais expliquer uniquement l'un d'entres eux (le reste étant équivalent).

Les 4 modèles de données sont :

-   `Alim` : les aliments
-   `AlimGroup` : les groupes d'aliments
-   `Const` : les constantes de compositions alimentaire
-   `Compo` : les compositions alimentaire

Pour créer un modèle il faut créer une classe héritant de `Base` qui est notre modèle déclaratif de BDD. On spécifie ensuite sont nom de table dans `__tablename__` puis on décrit la structure de la table avec des `Column()`. SQLAlchemy se chargera de tout traduire en code SQL pour l'initialisation et les requêtes.

```python
# const.py
from sqlalchemy import Column, Integer, String
from database import Base


class Const(Base):
    __tablename__ = "consts"
    code = Column(Integer, primary_key=True)
    nom_fr = Column(String(100), unique=True)
    nom_eng = Column(String(100), unique=True)

    def __init__(self, code=None, nom_fr=None, nom_eng=None):
        self.code = code
        self.nom_fr = nom_fr
        self.nom_eng = nom_eng

    def __repr__(self):
        res = "===CONST===\n"
        res += f"Code: {self.code}\n"
        res += f"Nom fr: {self.nom_fr}\n"
        res += f"Nom eng: {self.nom_eng}\n"

        return res
```

Ainsi on va pouvoir créer une table "consts" avec une colonne contenant le code de la constante, une chaine de caractères pour son nom en français et une pour son nom en anglais.

### Insérer des données dans la BDD

On a maintenant une structure fonctionnellement mais vide de données, on va la remplir à partir des fichiers XML fournis par Ciqual.

Par exemple pour les constantes on va faire (une fois de plus le code est équivalent pour les 3 autres types de donnée) :

```python
from xml.etree.ElementTree import Element

def get_constants(filename="const_2020_07_07.xml"):
    root = ET.parse(filename).getroot()

    res = []
    for element in root.findall("CONST"):
        res.append(const_from_xml(element))

    return res

def const_from_xml(node: Element):
    const = Const()

    const.code = node.find("const_code").text.strip()
    const.nom_fr = node.find("const_nom_fr").text.strip()
    const.nom_eng = node.find("const_nom_eng").text.strip()

    return const
```

On peut maintenant récupérer une liste d'objets correspondant aux constantes et dans un format qui est compréhensible par l'ORM. Il ne reste plus qu'à l'ajouter à la base de données. On peut ajouter comme vérification le fait que la base de données soit vide ou non pour la remplir ou non (le chargement des données étant relativement gourmand en resources et en temps).

```python
from database import db_session

# on ajoute les constantes à la requête SQL
db_session.add_all(get_constants())
# on applique les modifications à la base de données
db_session.commit()
```

### Récupérer les données

Tout est en ordre, on a une base de données configurée pour contenir les informations qui nous intéressent. Il ne reste plus qu'à les extraires pour afficher les informations d'un ingrédient.

Pour récupérer une donnée avec SQLAlchemy, on utilise l'attribut `query` du modèle qui nous intéresse. Par exemple pour récupérer une constante contenant le mot énergie :

```python
Const.query.filter(Const.nom_fr.like("%énergie%")).first()
```

Dans l'ordre, on va filtrer la base de données. Le paramètre de filtration est la colonne `nom_fr` et nous allons chercher les occurences semblables au mot "énergie" (comme `LIKE` en SQL). Enfin on va récupérer le premier élément de cette recherche (pour tous les récupérer on peut utilise `.all()`).

Je peux maintenant construire une fonction étant donné un aliment en entrée (récupéré avec une fonction de recherche par exemple) :

```python
def get_ingredient_details(aliment: Alim):
  code_alim = aliment.code

  # on récupère le groupe de l'aliment
  groupe = AlimGroup.query.filter(AlimGroup.group_code == ing.groupe_code).first()

  # on récupère toutes les compositions de l'ingrédient
  compositions = Compo.query.filter(Compo.alim_code == code_alim).all()
  # pour chacune des compositions on récupère la constante associée
  constantes = [Const.query.filter(Const.code == compo.const_code).first() for compo in compositions]

  # on va créer un objet JSON contenant toutes ces données
  compo_json = [{ \
    "code": consts[k].code, \
    constantes[k].nom_fr: compositions[k].teneur, \
    "confiance": compos[k].code_confiance} for k in range(len(compos))]
  return {"ingredient": aliment, "groupe": groupe, "composition": compo_json}
```

Ainsi pour un ingrédient comme des carottes pour exemple, on obtient une sortie ressemblant à ceci :

```json
{
    "ingredient": {
        "code": 20307,
        "nom_fr": "Carotte, cuite à la vapeur",
        "nom_index_fr": "Carotte",
        "nom_eng": "Carrot, steamed",
        "groupe_code": 2,
        "ssgroupe_code": 201,
        "ssssgroupe_code": 20102
    },
    "groupe": {
        "group_code": 2,
        "group_nom_fr": "fruits, légumes, légumineuses et oléagineux",
        "group_nom_eng": "fruits, vegetables, legumes and nuts",
        "ssgroup_code": 201,
        "ssgroup_nom_fr": "fruits, légumes, légumineuses et oléagineux",
        "ssgroup_nom_eng": "fruits, vegetables, legumes and nuts",
        "ssssgroup_code": 201,
        "ssssgroup_nom_fr": "fruits, légumes, légumineuses et oléagineux",
        "ssssgroup_nom_eng": "fruits, vegetables, legumes and nuts"
    },
    "composition": [
        {
            "code": 327,
            "Energie, Règlement UE N° 1169/2011 (kJ/100 g)": "175",
            "confiance": "A"
        },
        {
            "code": 328,
            "Energie, Règlement UE N° 1169/2011 (kcal/100 g)": "41,6",
            "confiance": "A"
        },
        {
            "code": 332,
            "Energie, N x facteur Jones, avec fibres  (kJ/100 g)": "175",
            "confiance": "A"
        },
        {
            "code": 333,
            "Energie, N x facteur Jones, avec fibres  (kcal/100 g)": "41,6",
            "confiance": "A"
        },
        {
            "code": 400,
            "Eau (g/100 g)": "87,7",
            "confiance": "A"
        },
        {
            "code": 10000,
            "Cendres (g/100 g)": "0,63",
            "confiance": "A"
        },
        {
            "code": 10004,
            "Sel chlorure de sodium (g/100 g)": "0,11",
            "confiance": "A"
        },
        {
            "code": 10110,
            "Sodium (mg/100 g)": "45",
            "confiance": "A"
        },
        {
            "code": 10120,
            "Magnésium (mg/100 g)": "10",
            "confiance": "A"
        },
        {
            "code": 10150,
            "Phosphore (mg/100 g)": "19",
            "confiance": "B"
        },
        {
            "code": 10170,
            "Chlorure (mg/100 g)": "76,1",
            "confiance": "A"
        },
        ...
}
```

J'ai coupé la fin du fichier, en effet la table Ciqual possède beaucoup d'indicateurs.

## Conclusion

La table d'informations nutritionnelles Ciqual est vraiment impressionnante par le nombre d'aliments recensés et par sa qualité.

Je suis maintenant en mesure d'indiquer automatiquement les valeurs nutritionnelles d'un aliment à partir de son nom ou de son code. Ça me sera grandement utile dans la nouvelle itération de mon projet "_A Chef in the Fridge_".
