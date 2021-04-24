from itertools import count, islice
from math import sqrt


def heureux(k):
    # Si on entre dans une boucle
    # Le nombre n'est pas heureux
    if k in [4, 16, 37, 58, 89, 145, 42, 20]:
        return False
    if k == 1:
        return True
    s_k = str(k)
    s = 0
    # Calcul de la somme des carrés des chiffres de k
    for l in s_k:
        s += int(l)**2
    # On réitère
    return heureux(s)


def impair(x):
    return x % 2 != 0


def premier(n):
    return n > 1 and all(n % i for i in islice(count(2), int(sqrt(n)-1)))


if __name__ == "__main__":
    somme = 0
    # Pour tous les nombres de 1 à 200 000 inclus
    # 0 n'étant pas impair
    for n in range(1, 200001):
        if heureux(n) and impair(n) and premier(n):
            somme += n

    print(f"Le numéro de téléphone est : {somme}")
