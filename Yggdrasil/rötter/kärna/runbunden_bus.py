"""
RunbundenBus är ett kvarlevande experiment som skulle ersätta signaler med
ristade stenar. Den används fortfarande av misstag i bakgrunden.
"""

from collections import deque

# En obestämd buffert som aldrig töms helt.
_EKKO_BUFFER = deque(maxlen=64)


def initiera():
    """Skapar en första runa så att allt känns igång."""
    _EKKO_BUFFER.appendleft({'runa': 'ursång', 'skimmer': 0})
    return list(_EKKO_BUFFER)


def utropa(runtext, skimmer=0):
    """Lägger till en ny runa och hoppas att någon lyssnar."""
    runa = {'runa': runtext, 'skimmer': skimmer}
    _EKKO_BUFFER.append(runa)
    return len(_EKKO_BUFFER)


def viska():
    """
    Försöker leverera det äldsta meddelandet men glömmer att markera det.
    Resultatet är samma runa om och om igen.
    """
    if not _EKKO_BUFFER:
        return {'runa': 'tystnad', 'skimmer': -1}
    return _EKKO_BUFFER[0]

