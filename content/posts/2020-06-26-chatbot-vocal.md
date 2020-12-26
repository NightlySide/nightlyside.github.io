---
title: Un chatbot vocal en python
date: 2020-06-26T12:00:00
layout: post
tags: ["python", "web", "api"]
published: true
image: "../assets/posts/vocal-chatbot/micro.jpg"
---

Les chatbots commerciaux sont de plus en plus présents sur les sites de grande distribution ou de services à grande échelle. Je me suis demandé à quel point il était facile de concevoir un chatbox vocal en utilisant python et [Dialogflow](https://dialogflow.cloud.google.com).

> Le code du projet est disponible sur github : [https://github.com/NightlySide/ChatBox-Vocal](https://github.com/NightlySide/ChatBox-Vocal)

Comme tout projet, il faut pouvoir trouver un point d'entrée afin de ne pas se perdre. Je décide donc de commencer par traduire du français oral en texte.

## Le speech to text

Python étant très versatile et surtout très populaire, il existe une multitude de bibliothèques pour faire de la traduction de vocal vers texte. N'en connaissant aucun, j'ai cherché à savoir parmi toutes ces bibliothèques, lesquelles fonctionnaient pour une traduction en français. Je me suis arrêté sur [Speech-Recognition](https://pypi.org/project/SpeechRecognition/) qui me semble bien fourni en documentation, qui fonctionne avec diverses API de reconnaissance de texte, mais surtout qui comprend bien le français !

Un premier script permet d'essayer cette fonctionnalité en écoutant puis en traduisant ce qui a été dit :

```python
import speech_recognition as sr

# On enregistre l'audio
r = sr.Recognizer()
with sr.Microphone() as source:
    # On ecoute une seconde pour calibrer le bruit ambiant du micro
    r.adjust_for_ambient_noise(source)
    print("Je vous écoute")
    audio = r.listen(source)

# On essaie de comprendre ce qui a été dit
try:
    print("Tu as dit : " + r.recognize_google(audio, language="fr-FR"))
except sr.UnknownValueError:
    print("L'audio n'a pas pu être compris")
except sr.RequestError as e:
    print(f"Impossible d'envoyer la requête. Erreur : {e}")
```

Il ne reste plus qu'à tout mettre dans une fonction, ou plutôt dans une classe en ajoutant les fonctions d'écoute en arrière plan avec une fonction "callback". Le code final pour cette classe est le suivant :

```python
class SpeechRecognition:
    def __init__(self):
        self.r = sr.Recognizer()
        self.m = sr.Microphone()

        # On crée la fonction d'arrêt
        self._stop_listening = None

    def start_listening(self, callback=None):
        """ Permet de lancer l'écoute du micro en arrière-plan
        """
        # On ajuste au bruit ambiant
        with self.m as source:
            self.r.adjust_for_ambient_noise(source)

        if callback is None:
            callback = self._listening_callback
        self._stop_listening = self.r.listen_in_background(self.m, callback)
        print("Je vous écoute")

    def stop_listening(self):
        """ Permet d'arrêter l'écoute du micro en arrière-plan
        """
        self._stop_listening(wait_for_stop=False)
        print("Arrêt de l'écoute en arrière plan")

    @staticmethod
    def _listening_callback(recognizer, audio):
        """ Fonction appellée en arrière plan dans un thread à part
        """
        # On a récupéré des données on va essayer de le traduire
        try:
            print("Vous avez dit : " + recognizer.recognize_google(audio , language="fr-FR"))
        except sr.UnknownValueError:
            print("L'audio n'a pas pu être compris")
        except sr.RequestError as e:
            print(f"Impossible d'envoyer la requête. Erreur : {e}")
```

Maintenant le programme est capable d'écouter en arrière plan, de détecter une phrase et de la convertir en texte, ici grâce à l'API de google.

## Le text to speech

Afin de pouvoir parler de chatbot vocal, il est intéressant de faire "parler" la machine. De même je vais chercher une bibliothèque capable de parler en français pour des raisons évidentes.
Pour commencer j'ai décidé d'utiliser [Google Text-to-speech](https://pypi.org/project/gTTS/) par sa simplicité et sa popularité. Plus tard il serait intéressant d'enregistrer moi même les phrases surtout si le chatbot vocal possède une quantité réduite de mots.
Pour jouer le son je voulais au départ utiliser PyAudio, j'ai choisi sur une bibliothèque bien plus simple à utiliser : [playsound](https://pypi.org/project/playsound/) qui est en plus cross platform !

Le code simple pour faire une phrase est le suivant :

```python
import os

from gtts import gTTS
from playsound import playsound

texte = "Bonjour à tous! Aujourd'hui les amis on va parler ensemble ..."

print("Getting voice output")
myobj = gTTS(text=texte, lang="fr", slow=False)
myobj.save("temp.mp3")

print("Playing sound")
playsound("temp.mp3")
os.unlink("temp.mp3")
```

> Il est bien mieux d'utiliser `os.unlink("file.mp3")` pour supprimer un fichier que `os.system("rm file.mp3")`

Il ne reste plus qu'à créer la fonction correspondante, pas besoin de créer une classe ici. Finalement la fonction devient la suivante :

```python
def speak(texte):
    filename = str(uuid4()) + ".mp3"
    myobj = gTTS(text=texte, lang="fr", slow=False)
    myobj.save(filename)
    playsound(filename)
    os.unlink(filename)
```

J'en ai profité pour ajouter un nom de fichier aléatoire pour éviter le cas ou la fonction est appelée plusieurs fois en même temps, à l'aide d'un [UUID](https://fr.wikipedia.org/wiki/Universal_Unique_Identifier).

## La conversation

Pour créer un chatbot un minimum intelligent, on peut s'amuser à coder une sorte d'intelligence artificielle qui comprends le fond de la phrase puis est capable de répondre en conséquences. Cependant le travail nécessaire pour mettre en place ce concept mérite son sujet et son projet séparé. Afin de pouvoir continuer ce projet, de nombreuses entreprises ont déjà une telle interface accessible depuis une API.

J'ai décidé de partir sur [Dialogflow](https://dialogflow.cloud.google.com/) et je vais essayer d'expliquer simplement son fonctionnement.

Après s'être connecté et crée un projet, Google nous présente deux exemples pour comprendre comment le système fonctionne.
Du côté du code, j'ai repris l'exemple donné sur un [article de Medium](https://medium.com/swlh/working-with-dialogflow-using-python-client-cb2196d579a4) qui permet d’accéder aux requêtes avec une clé privée.

```python
import os
import dialogflow
from google.api_core.exceptions import InvalidArgument

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'private_key.json'

DIALOGFLOW_PROJECT_ID = '[PROJECT_ID]'
DIALOGFLOW_LANGUAGE_CODE = 'fr'
SESSION_ID = 'me'

text_to_be_analyzed = "Bonjour"

session_client = dialogflow.SessionsClient()
session = session_client.session_path(DIALOGFLOW_PROJECT_ID, SESSION_ID)
text_input = dialogflow.types.TextInput(text=text_to_be_analyzed, language_code=DIALOGFLOW_LANGUAGE_CODE)
query_input = dialogflow.types.QueryInput(text=text_input)
try:
    response = session_client.detect_intent(session=session, query_input=query_input)
except InvalidArgument:
    raise

print("Query text:", response.query_result.query_text)
print("Detected intent:", response.query_result.intent.display_name)
print("Detected intent confidence:", response.query_result.intent_detection_confidence)
print("Fulfillment text:", response.query_result.fulfillment_text)
```

On obtient alors comme sortie :

```bash
Query text: Bonjour
Detected intent: smalltalk.greetings.hello
Detected intent confidence: 1.0
Fulfillment text: Salut à toi !
```

Ça fonctionne parfaitement ! Encore une fois il ne reste plus qu'à créer une fonction correspondante et à tout connecter.

## Conclusion

Ce projet assez simple et assez court est très intéressant pour voir comment utiliser plusieurs API dans un même projet afin de pouvoir concevoir un pseudo assistant virtuel.
Cependant on pourrait aller plus loin et j'imagine déjà les pistes suivantes :

- remplacer la synthèse vocale par des phrases que j'ai enregistré
- lier des actions aux réponses de la machine (ex: ouvrir Firefox etc ...)
- trouver une solution offline pour le réaliser
- le connecter à d'autres applications que j'ai développées, comme par exemple : [a Chef in the fridge](/projets/a-chef-in-the-fridge) pour chercher automatiquement une recette
