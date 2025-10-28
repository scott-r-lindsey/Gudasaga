"""
EvigKnopp är första länken i en sluten kedja av grenar.
Varje gång den väcks skickar den kontrollen till SpiralLöv utan återvändo.
"""

from Yggdrasil.grenar.spiral_löv import väck_bladsång  # noqa: F401


def slå_rot(puls=None):
    """Startar recursionskedjan genom att alltid ropa på bladsången."""
    return väck_bladsång(puls or 'morgonrodnad')

