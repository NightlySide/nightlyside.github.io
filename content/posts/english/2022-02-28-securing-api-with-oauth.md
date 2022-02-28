---
title: Securing an API using JWT and Python
date: 2022-02-28T09:00:00
layout: post
tags: ["jwt", "web", "security", "api"]
published: true
image: "../../assets/posts/english/jwt_decoded.png"
---

When it comes to the design of an application protocol interface (_API_), some keywords crop up on the internet like REST or CRUD. However security comes last in the design process. In this post you will learn how to make your API secure, using state of the art technology in your python project.

To follow this post you should know what an API is and have some experience coding with python.

> Make sure python 3.x in installed on your computer in order to make the following snippets work.

# What are web tokens?

Take a second to think about your API. Perhaps you are fetching data from a specific endpoint which needs to be secured. How can you be sure the request is legitimate or the user making the request has the required rights to do so?

A good practice is to use authorization tokens. To be more specific we will use Javascript Web Tokens (_JWT_).

## Javascript Web Token

> « _JSON Web Token (JWT, pronounced /dʒɒt/, same as the word "jot") is a proposed Internet standard for creating data with optional signature and/or optional encryption whose payload holds JSON that asserts some number of claims._ » - Wikipedia

In a nutshell, a JWT is a token holding information that can be verified in order to authenticate a user and their rights. This token will be sent in the header of the request or as a query argument to give context to the API.

A JWT token can be broken down into three pieces, separated by a point (".") :

-   an **header** describing the token type and the hashing algorithm used
-   a **payload** with the token's content, for example the username, the user's role, expiration of the token, ...
-   a **signature** which will take the header and the payload, encoded using base64, concatenated with a **secret** which yields a hash to verify the authenticity of the token

The signature is optional for JWT tokens to work. However, is no signature is provided, anyone can compromise and change the content carried by the token.

## Example

For the following example, the payload will be the username, the role, the creation date and the secret will be _my_super_secret_. I am using [jwt.io](https://jwt.io/) in order to deconstruct the token.

![JWT example](../../assets/posts/english//jwt_example.png)

The website returns the following token :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRob21hc190aGVfdHJhaW4iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.jvPs4WoDqqj2fhsRmgGushRvfOq--UkZizfyZqu88bE
```

## Verifying a JWT token

As I wrote above, a JWT token can be verified to be sure the payload has not been modified by an attacker.

To verify the token, the server has to know the secret, so that the signature can be recreated on the server side and compared to the signature provided to see if the token is legitimate.

Knowing the common secret, the server hosting the API can build the signature using the base64 encoded header and payload, joined using a point, concatenating the secret and hashing the whole with the algorithm specified in the token header (here HS256).

The token is legitimate if both signatures match, otherwise it has probably been modified, either maliciously or due to an error.

# API boilerplate code

If you do not have some kind of API to tinker with, you can grab the following code which will serve a small API with two endpoints:

-   `/public`: can be seen by anyone
-   `/private`: should be seen by authenticated users only

```python
# -- main.py --
from fastapi import FastAPI
app = FastAPI()


@app.get("/public")
async def public_page():
    return {"message": "Hello, world!"}

@app.get("/private")
async def private_page():
    return {"message": "This is the private page"}
```

> If you do not have FastAPI nor uvicorn installed, you can simply execute the following to get it :
> `python -m pip install FastAPI uvicorn`

You should be able to launch the API using :

```bash
uvicorn main:app --reload
```

![Launching the API](../../assets/posts/english//launch_API.png)

Make sure the API is working by visiting [http://127.0.0.1:8000/public](http://127.0.0.1:8000/public) which should yield the following response :

```JSON
{
    "message": "Hello, world!"
}
```

The following section will finally implement security into the API.

# A JWT implementation in python

Fortunately clever people made our job easier by building appropriate tools. The website [jwt.io](https://jwt.io/) provides a list of libraries implementing the JWT creation and verification process.

> For this post I picked `jwcrypto` for its compliance with recents RFC. You can install this library executing : `python -m pip install jwcrypto`.

## Token creation

The first step is to import the library and create our secret :

```python
from jwcrypto import jwk, jwt

# generating a key from a secret
key = jwk.JWK.from_password("my_super_secret")

# we can see the JW key content with secret.export()
# {"k":"bXlfc3VwZXJfc2VjcmV0","kty":"oct"}
```

Then we can build the header and the payload (known as "claims" as well) :

```python
import time

header = {
    "type": "jwt",
    "alg": "HS256"
}

claims = {
    "username": "thomas_the_train",
    "role": "admin",
    "exp": int(time.time() + (3 * 60))
}

# building the token
token = jwt.JWT(header, claims)
# adding the signature
token.make_signed_token(key)
# making it into a string
signed_token = token.serialize(compact=True)
```

Once this script is running, you should see something similar on your screen :

```
eyJhbGciOiJIUzI1NiIsInR5cGUiOiJqd3QifQ.
eyJleHAiOjE2NDQ4MjgxNTAsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoidGhvbWFzX3RoZV90cmFpbiJ9.
zAS1YRrLBbhiJwI8_aycWYmc6IclooequgI6rQUsE54
```

If I decode this token using [jwt.io](https://jwt.io/) we get the following :

![JWT decoded](../../assets/posts/english//jwt_decoded.png)

## Verifying a token

Suppose we get a token in a GET request (_req_token_), how can we verify its authenticity?
Again, _jwcrypto_ gives us a hand to verify this piece of data.

```python
from jwcrypto import jwk, jwt

# generating the same key as before
key = jwk.JWK.from_password("my_super_secret")

# testing the key
try:
    token = jwt.JWT(key=key, jwt=token_str)
    # here the token is valid we can work with it
except:
    # here the token is invalid, we should notice the user
```

## Wrap up

Once these concepts are familiar with you we can build two new functions to create and verify tokens. Try first by yourself then compare it with the following code :

```python
def make_token(key: jwk.JWK, payload={}):
    # same header for all tokens
    header = {"type": "jwt", "alg": "HS256"}

    # building and signing the token
    token = jwt.JWT(header, payload)
    token.make_signed_token(key)

    # returning the token as a string
    signed_token = token.serialize(compact=True)
    return signed_token

def is_token_valid(key: jwk.JWK, token_str: str):
    try:
        # if we manage to make a new token from the string
        # then the token is legit
        _ = jwt.JWT(key=key, jwt=token_str)
        return True
    except:
        # else the token is invalid
        return False
```

# Securing the API

## Building a small login endpoint

For this post to be reasonably short, we will hardcode some credentials into the API. You can build something similar with a database, here the users' credentials will be a simple list :

```python
users = [{
    "username": "admin",
    "password": "password"
}]
```

Please, for production use stronger credentials I beg you.

We continue by writing a new endpoint utilizing the previous functions we built above :

```python
@app.get("/login")
async def login_page(username: str, password: str):
    usernames = [user["username"] for user in users]
    if username not in usernames:
        return {"status": "error", "message": "User not in database"}

    user_id = usernames.index(username)
    user = users[user_id]
    if user["password"] != password:
        return {"status": "error", "message": "Wrong user/password combination"}

    return {
        "status": "success",
        "token": make_token(key, {"user": user["username"], "exp": (time.time() + (3*60))})
    }
```

Then to test this new page, go to [http://127.0.0.1/login?username=admin&password=password](http://127.0.0.1/login?username=admin&password=password). You should be greeted with a brand new token :

```json
{
	"status": "success",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cGUiOiJqd3QifQ.eyJleHAiOjE2NDUwMzEwNDIuNzc2MjI1LCJ1c2VyIjoiYWRtaW4ifQ.1O7QCylGL8M2dvvXSe3Q4l_c2NnxfMEHZ7Stuv4vmqo"
}
```

## Protect the private page

The last step will be to protect the private page. With no or a bad token provided, the endpoint should return an error. Without a token, or a bad token, the endpoint should return an error.

For this we will be using a middleware. In a nutshell a middleware is a piece of code sitting between two processes.

This middleware we are going to write, is code checking for the validity of a JWT token being provided.

```python
@app.get("/private")
async def private_page(token: str):
    # if there is no token or the token is invalid
    if token is None or not is is_token_valid(key, token):
        return "You are not authorized"

    # else the user is authenticated
    return "<h1>Welcome to the private section of this website</h1>"
```

# Conclusion

This is everything there is to know in order to start designing and building a secure API from the ground up using as few librairies as ~~comfortably~~ possible.

As of now, a delivered token does not really have any system of revocation. In the case where a token is compromised (stolen for example), anyone with this token will be able to impersonate the user.

Another topic about security around token authorization is the concept of scopes, which is way beyond the goal of this article.

The next article will be on token revocation using a second token called a **Refresh Token**.
