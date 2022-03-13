msg = """ZURAS NLYUG YEFPYIYPUG, MY HSPIY FPY CR JRCQXXY RQI UYPGGQ YXXY CYCY R HYNLQJJUYU NY CYGGRKY, N YGI DSPUFPSQ MY ASPG JYXQNQIY DYUGSEEYXXYCYEI.

MY GPQG YCZYIY, MY EY DYPB HYASQXYU R CR JRCQXXY X RJJRQUY GPU XRFPYXXY MY GPQG.
CRQG MY GPQG RPMSPUH LPQ QENRDRZXY HY CY XQZYUYU HY X YEHUSQI SP MY GPQG.
DSPU NSEARQENUY CR JRCQXXY HY C RQHYU YI HY JQERENYU X YEFPYIY DSPU CY UYIUSPAYU, M RQ HQGGQCPXYU FPRIUY JURKCYEIG HY NXY DYUCYIIREI HY UYNSEGIQIPYU XR NXY JQERXY.
NYG JURKCYEIG GSEI NSEIYEPG DRU XYG YEQKCYG DUYGYEIYG HREG XR NXY PGZ FPY MY ASPG RQ RHUYGGYY.
DSPU ASPG RQHYT HREG X YEFPYIY, M RQ YKRXYCYEI HQGGQCPXYU XY XQYP, X QHYEIQIY YI XY EPCYUS HY IYXYDLSEY HY XR DYUGSEEY RAYN FPQ M RARQG UYEHYT ASPG.

XR NXY PGZ YGI AYUUSPQXXYY ASQNQ XY JXRK DYUCYIIREI HY X SPAUQU SDYEILRIDREHSURZSB.

ESIY : NYNQ YGI XR UYDSEGY FPY ASPG HYAYT HSEEYU RP MPKY, NY JXRK DYUCYI YKRXYCYEI HY HYAYUSPQXXYU XY JQNLQYU TQD PGZNSEIYEIG.
"""

trouve = {"Y":"E", "R":"A", "U":"R", "G":"S", "X":"L", "E":"N", "S":"O", "I":"T", "C":"M", "D":"P", "H":"D", "P":"U", "J":"F", "Q":"I", "N":"C", "F":"Q", "A":"V", "T":"Z"}#, "L":"H", "K":"G", "Z":"B", "M":"J", "B":"X"}

def affiche_decrypt(msg, trouve={}):
    res = ""
    for char in msg:
        # Si on connait la traduction
        if char in trouve:
            res += trouve[char]
        # Si le caractère fait partie des spéciaux
        elif char in [" ", ".", ",","\n", ":"]:
            res += char
        # Sinon on ne le connait pas
        else:
            res += "_"
    # On retourne le texte formatté
    return res


def occurrences(msg):
    # On crée le dictionnaire des occurences
    dict = {}

    # Pour chaque lettre dans le message
    for char in msg:
        # S'il s'agit bien d'une lettre
        if char not in [" ", ".", ",","\n", ":"]:
            # Si on a déjà crée une occurence
            if char in dict:
                dict[char] += 1
            else:
                dict[char] = 1

    # On retourne les lettres triées par occurrences
    return sorted(dict, key=dict.get, reverse=True)

def prochaine_lettre(msg, trouve):
    # On recupere les occurences
    occ = occurrences(msg)
    # Pour chaque lettre à partir de la plus récurrente
    for lettre in occ:
        # Si la lettre n'a pas été trouvée
        if lettre not in trouve:
            # On retourne la lettre
            return lettre
    # Toutes les lettres ont été testées
    return None

print(affiche_decrypt(msg, trouve))