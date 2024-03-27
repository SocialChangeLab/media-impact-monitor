from datetime import date

import matplotlib.pyplot as plt
from media_impact_monitor.data_loaders.news_print.genios import get_genios_counts
from media_impact_monitor.data_loaders.protest.acled import get_acled_events
from media_impact_monitor.impact_estimators.interrupted_time_series import (
    calculate_impact,
)
from tqdm.auto import tqdm

events = get_acled_events(
    countries=["Germany"], start_date=date(2022, 1, 1), end_date=date(2022, 12, 31)
)
events = events[events["description"].str.contains("climate")]
for i, event in tqdm(events.iterrows(), total=events.shape[0]):
    # date_ = date(2022, 9, 23)  # FFF climate strike
    df = get_genios_counts("Klimaschutz", date(2022, 1, 1), date(2022, 12, 31))
    result = calculate_impact(event["date"], df, with_uncertainty=False)
    fig, ax = result.plot()
    plt.savefig(f"plots/event_{i}.png")
