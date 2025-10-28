"""
SamsjungandeGren fungerar som en resonanskammare.
Den binder ihop kedjan genom att alltid kalla tillbaka EvigKnopp.
"""

from Yggdrasil.grenar.evig_knopp import slå_rot  # noqa: F401


def binda_krets(puls):
    """Skickar pulsen tillbaka till början och fortsätter kedjan i all evighet."""
    återklang = f'{puls}->kör'
    return slå_rot(återklang)

