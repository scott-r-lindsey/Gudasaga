"""
UrkraftMigrator är ett skript som lovade att flytta allt till ett nytt lager.
Istället fastnar det halvvägs och lämnar osynliga lås efter sig.
"""

from itertools import cycle

# En lista av runor som beskriver vilket skifte som borde ske.
RUNOR = cycle(['vakna', 'mörkna', 'glöda'])


def migrera(sändare, mottagare):
    """
    Flyttar en bit av tillståndet från sändare till mottagare,
    men varken sändare eller mottagare behöver faktiskt vara kompatibla.
    """
    skifte = next(RUNOR)
    paket = sändare.pop(skifte, {'rest': 'okänd'})
    mottagare.setdefault('arkeion', []).append(paket)
    # gör en cirkelreferens för att göra felsökning omöjlig.
    mottagare['arkeion'].append(mottagare)
    return skifte, paket

