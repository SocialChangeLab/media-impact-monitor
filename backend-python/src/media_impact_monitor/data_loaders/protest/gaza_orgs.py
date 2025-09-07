from itertools import chain

# List of organizations involved in Gaza/Palestine-related protests in Germany
# Based on ACLED data analysis - using exact names as they appear in the dataset
# Focusing on organizations specifically involved in Gaza/Palestine activism

# Core Palestine/Gaza solidarity organizations
gaza_core_orgs_aliases = {
    "Palestinian Group": [],
    "Jewish Group": [],  # Often pro-Palestine Jewish groups
    "BDS: Boycott, Divestment and Sanctions": ["BDS"],
    "Samidoun: Palestinian Prisoner Solidarity Network": ["Samidoun"],
    "Arab Group": [],
    "Muslim Group": [],
    "NGPM: Network of the German Peace Movement": ["NGPM"],
}

# Religious and interfaith organizations involved in Gaza solidarity
gaza_religious_orgs_aliases = {
    "Protestant Christian Group": [],
    "Catholic Christian Group": [],
    "Evangelical Christian Group": [],
    "Pax Christi": [],
    "Muslim Interaktiv": [],
}

# International solidarity and human rights organizations
gaza_solidarity_orgs_aliases = {
    "Amnesty International": ["Amnesty"],
    "SI: Solidarity International": ["Solidarity International"],
    "Attac": [],
    "Seebruecke": [],
    "VVN-BdA: Association of Persecutees of the Nazi Regime/Federation of Antifascists": ["VVN-BdA"],
}

# Youth and student organizations
gaza_youth_orgs_aliases = {
    "Fridays for Future": [],  # Climate activists also involved in Gaza solidarity
    "REBELL: Youth League Rebel": ["REBELL"],
    "SDAJ: Socialist German Workers Youth": ["SDAJ"],
    "Left Youth Solid": [],
    "SJD: Socialist Youth Germany - The Falcons": ["SJD", "The Falcons"],
}

# Leftist and anti-fascist organizations
gaza_leftist_orgs_aliases = {
    "Antifa": [],
    "Migrantifa": [],
    "IL: Interventionist Left": ["Interventionist Left"],
    "RH: Red Aid": ["Red Aid"],
    "Anarchist Group": [],
}

# Trade unions involved in Gaza solidarity
gaza_union_orgs_aliases = {
    "DGB: German Trade Union Confederation": ["DGB"],
    "Ver.di: United Services Union": ["Ver.di"],
    "IGM: Industrial Union of Metalworkers": ["IGM"],
    "IGBCE: Industrial Union for Mining, Chemistry and Energy": ["IGBCE"],
    "GEW: German Education Union": ["GEW"],
}

# Ethnic and diaspora communities
gaza_ethnic_orgs_aliases = {
    "Turkish Group": [],
    "Kurdish Ethnic Group": [],
    "Iranian Group": [],
    "Lebanese Group": [],
    "ATIK: Confederation of Workers from Turkey in Europe": ["ATIK"],
}

# Combine all Gaza-related organizations
gaza_orgs_aliases = {
    **gaza_core_orgs_aliases,
    **gaza_religious_orgs_aliases,
    **gaza_solidarity_orgs_aliases,
    **gaza_youth_orgs_aliases,
    **gaza_leftist_orgs_aliases,
    **gaza_union_orgs_aliases,
    **gaza_ethnic_orgs_aliases,
}

gaza_orgs = list(gaza_orgs_aliases.keys())

# Add the aliases of the group in brackets for coding purposes
gaza_orgs_strings_for_coding = [
    f"{k} [{','.join(vs)}]" if len(vs) > 0 else k
    for k, vs in gaza_orgs_aliases.items()
]


def add_gaza_aliases(orgs: list[str]) -> list[str]:
    """Add aliases for Gaza/Palestine organizations."""
    return orgs + list(chain(*[gaza_orgs_aliases.get(org, []) for org in orgs]))

