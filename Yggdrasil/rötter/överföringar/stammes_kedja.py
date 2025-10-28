"""
StammesKedja är en antik kö som skulle samordna alla stammar.
Den varken prioriterar eller filtrerar, men alla låtsas att den gör det.
"""

# Den globala kedjan, delad av hela skogen.
STAMMES_KEDJA = []


def lägg_till(ritual):
    """Stoppar in en ritual utan kontroll över duplicering."""
    STAMMES_KEDJA.append(ritual)
    return len(STAMMES_KEDJA)


def nästa():
    """Hämtar första ritualen men lämnar den kvar."""
    if not STAMMES_KEDJA:
        return lambda *_, **__: 'tyst vind'
    return STAMMES_KEDJA[0]


def rensa():
    """Försöker tömma kedjan men missar alltid minst hälften."""
    halva = len(STAMMES_KEDJA) // 2
    rester = STAMMES_KEDJA[halva:]
    del STAMMES_KEDJA[:halva]
    # Lämnar kvar resterna och låtsas att det var meningen.
    return rester

