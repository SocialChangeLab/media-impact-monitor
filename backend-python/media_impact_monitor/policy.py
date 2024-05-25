import pandas as pd

from media_impact_monitor.data_loaders.policy.bundestag.bundestag_api import (
    get_bundestag_vorgaenge,
)
from media_impact_monitor.types_ import PolicySearch
from media_impact_monitor.util.cache import cache


def _filter_sachgebiete(df, relevant_sachgebiete):
    mask = df["sachgebiet"].apply(
        lambda x: any(sach in relevant_sachgebiete for sach in x)
    )
    filtered_df = df.loc[mask].copy()  # avoids "SettingWithCopyWarning"

    # Include the tagged sachgebiete for the legend
    filtered_df["filtered_sachgebiete"] = filtered_df["sachgebiet"].apply(
        lambda x: [sach for sach in x if sach in relevant_sachgebiete]
    )

    return filtered_df


@cache
def get_policy(q: PolicySearch) -> pd.DataFrame:
    match q.policy_level:
        case "Germany":
            df = get_bundestag_vorgaenge(
                start_date=q.start_date,
                end_date=q.end_date,
                vorgangstyp=q.policy_type,
                # institution=
            )
        case "EU":
            raise NotImplementedError()

    match q.topic:
        case None:
            pass
        case "climate_change":
            # print("Filtering for Climate Change!")
            df = _filter_sachgebiete(
                df,
                relevant_sachgebiete=[
                    "Umwelt",
                    "Energie",
                    "Raumordnung, Bau- und Wohnungswesen",
                    "Landwirtschaft und Ernährung",
                    "Verkehr",
                ],
            )
        case "economics":
            df = _filter_sachgebiete(
                df,
                relevant_sachgebiete=["Wirtschaft"],
            )
        case _:
            raise ValueError(f"Unsupported topic: {q.topic}")

    return df
