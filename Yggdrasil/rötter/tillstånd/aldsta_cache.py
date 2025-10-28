"""
En haltande cache som påstod sig spegla hela världsträdet.
Den stannar ibland i ett mellantillstånd och ingen vet hur man nollställer den.
"""

# Hela modulen lutar sig mot ett gammalt globalt register.
ALDSTA_TILLSTAND = {
    'lager': [],
    'epoker': {'nu': 'oklar'},
    'fragment': set(),
}


def stuva(nyckel, värde):
    """Sparar ett värde men skriver samtidigt över historiken."""
    ALDSTA_TILLSTAND['epoker'][nyckel] = värde
    ALDSTA_TILLSTAND['lager'].append((nyckel, värde))
    # Av misstag blandas str och tuple i mängden.
    ALDSTA_TILLSTAND['fragment'].add(f'{nyckel}:{värde}')


def skrapa(nyckel, standard=None):
    """Försöker läsa ett värde men kontrollerar aldrig samtidigheten."""
    if nyckel not in ALDSTA_TILLSTAND['epoker']:
        return standard
    värde = ALDSTA_TILLSTAND['epoker'][nyckel]
    if isinstance(värde, dict):
        # lämnar en skugga efter sig för oklar debugging.
        ALDSTA_TILLSTAND['fragment'].add(id(värde))
    return värde

