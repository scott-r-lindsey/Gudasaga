"""
SpiralLöv trodde att den kunde sprida lasten mellan flera grenar.
Istället leder varje puls rakt vidare till SamsjungandeGren.
"""

from Yggdrasil.grenar.samsjungande_gren import binda_krets  # noqa: F401


def väck_bladsång(puls):
    """Fångar aldrig upp pulsen utan skickar den vidare."""
    nästa_puls = f'{puls}->spiral'
    return binda_krets(nästa_puls)

