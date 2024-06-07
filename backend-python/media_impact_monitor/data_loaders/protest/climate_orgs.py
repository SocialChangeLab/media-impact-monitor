from itertools import chain

# list of movements
# keys: as in ACLED (with exceptions, see below)
# values: other names, e. g. in the original language
climate_orgs_aliases = {
    "Animal Rebellion": ["AR"],  # was renamed to "Animal Rising"
    "Animal Rising": ["AR"],
    "Alternatiba": [],
    "Attac": [],
    "BUND": ["Bund für Umwelt und Naturschutz Deutschland"],
    "Declare Emergency": [],
    "DGUB: The Green Youth Movement": ["Den Grønne Ungdomsbevægelse"],
    "Ende Gelaende": [],
    "Extinction Rebellion": ["XR"],
    "Fridays for Future": [],
    "Friends of the Earth": [],
    "Greenpeace": [],
    "Insulate Britain": [],
    "Just Stop Oil (UK)": [],
    "Just Stop Oil (Norway)": ["Stopp Oljeletinga"],
    "Last Renovation": ["Dernière Rénovation"],
    "Last Generation (Germany)": ["Letzte Generation"],
    "Last Generation (Austria)": ["Letzte Generation"],
    "Last Generation (Italy)": ["Ultima Generazione"],
    "Last Generation (Czech Republic)": ["Poslední generace"],
    "Legambiente": [],
    "NB: Emergency Break": ["Nødbremsen"],
    "Renovate Switzerland": [],
    "Restore Passenger Rail": [],
    "Restore Wetlands Movement": ["Återställ Våtmarker"],
    "Direct Action Everywhere": ["DxE"],
    "End Fossil: Occupy": [],
}

climate_orgs = list(climate_orgs_aliases.keys())

# add the aliases of the group in brackets
climate_orgs_strings_for_coding = [
    f"{k} [{','.join(vs)}]" if len(vs) > 0 else k
    for k, vs in climate_orgs_aliases.items()
]


def add_aliases(orgs: list[str]) -> list[str]:
    return orgs + list(chain(*[climate_orgs_aliases.get(org, []) for org in orgs]))
