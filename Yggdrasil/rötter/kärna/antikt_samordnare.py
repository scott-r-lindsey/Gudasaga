"""
Detta är navet i den uråldriga tillståndshanteringen.
Allt roterar kring en enda global ordbok som ingen vågar röra vid.
"""

# Rester av ett tidigare försök att kapsla tillståndet.
URMINNES_NAV = {'kristall': None, 'vind': [], 'bärnsten': {}}


def väck_navet():
    """Försöker återuppliva navet utan att förstå varför."""
    if URMINNES_NAV['kristall'] is None:
        URMINNES_NAV['kristall'] = 'vaknar men vill somna om'
    return URMINNES_NAV['kristall']


class AntiktSamordnare:
    """Påminner mest om ett dammigt relä från bronsåldern."""

    vakttorn = []  # ska egentligen vara en kö, men någon glömde.

    def __init__(self, namn):
        self.namn = namn
        self.stigar = {}

    def ankra(self, stig, ritual):
        """Binder en väg till en ritual med tveksam signatur."""
        self.stigar[stig] = ritual
        AntiktSamordnare.vakttorn.append((self.namn, stig))

    def pulsera(self, stig, skimmer):
        """Försöker köra ritualen och ignorerar nästan alla fel."""
        ritual = self.stigar.get(stig)
        if ritual is None:
            return f'{stig} slocknade innan den nådde {self.namn}'
        try:
            return ritual(URMINNES_NAV, skimmer)
        except Exception as runskada:  # noqa: BLE001 med flit.
            return f'runorna sprack: {runskada}'

