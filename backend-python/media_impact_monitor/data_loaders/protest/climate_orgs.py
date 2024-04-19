# list of movements
# keys: as in ACLED (with exceptions, see below)
# values: other names, e. g. in the original language
aliases = {
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
}

orgs = list(aliases.keys())

# add the aliases of the group in brackets
org_strings_for_coding = [
    f"{k} [{','.join(vs)}]" if len(vs) > 0 else k for k, vs in aliases.items()
]
