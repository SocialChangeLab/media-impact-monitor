# list of movements
# keys: as in ACLED (with exceptions, see below)
# values: other names, e. g. in the original language
movement_aliases = {
    "Alternatiba": [],
    "Attac": [],
    "BUND": ["Bund für Umwelt und Naturschutz Deutschland"],
    "Declare Emergency": [],
    "DGUB: The Green Youth Movement": ["Den Grønne Ungdomsbevægelse"],
    "Ende Gelaende": [],
    "Extinction Rebellion": [],
    "Fridays for Future": [],
    "Friends of the Earth": [],
    "Greenpeace": [],
    "Insulate Britain": [],
    "Just Stop Oil (United Kingdom)": [],
    "Just Stop Oil (Norway)": ["Stopp Oljeletinga"],
    "Last Renovation": ["Dernière Rénovation"],
    "Last Generation (Germany)": ["Letzte Generation"],
    "Last Generation (Austria)": ["Letzte Generation"],
    "Last Generation (Italy)": ["Ultima Generazione"],
    "Legambiente": [],
    "Renovate Switzerland": [],
    "Restore Passenger Rail": [],
    "Restore Wetlands Movement": ["Återställ Våtmarker"],
}

movements = list(movement_aliases.keys())

# rationalizing movement keys to fit to ACLED
# (the above movement keys are consistent,
# but only after performing the below conversion will they match ACLED,
# which is not completely consistent imo)
acled_keys = [
    k.replace(
        "BUND", "BUND: German Federation for the Environment and Nature Conservation"
    )
    .replace("Fridays for Future", "FFF: Fridays for Future")
    .replace("Extinction Rebellion", "XR: Extinction Rebellion")
    .replace("Just Stop Oil (UK)", "Just Stop Oil")
    .replace("Just Stop Oil (Norway)", "Just Stop Oil")
    for k in movement_aliases.keys()
]

# add the aliases of the group in brackets
group_names_for_coding = [
    f"{k} [{','.join(vs)}]" if len(vs) > 0 else k for k, vs in movement_aliases.items()
]
