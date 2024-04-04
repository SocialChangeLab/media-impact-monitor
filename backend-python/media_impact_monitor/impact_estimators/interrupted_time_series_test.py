from datetime import date

import matplotlib.pyplot as plt
import numpy as np
from media_impact_monitor.data_loaders.news_print.genios import get_genios_counts
from media_impact_monitor.data_loaders.protest.acled import get_acled_events
from media_impact_monitor.impact_estimators.interrupted_time_series import (
    calculate_impact,
)
from tqdm.auto import tqdm

events = get_acled_events(
    countries=["Germany"], start_date=date(2022, 3, 1), end_date=date(2022, 9, 30)
)
events = events[events["description"].str.contains("climate")]
events = events.drop_duplicates(subset=["date"])
events = events.iloc[:20]
impacts = []
for i, event in tqdm(events.iterrows(), total=events.shape[0]):
    df = get_genios_counts("Klimaschutz", date(2022, 1, 1), date(2022, 12, 31))
    result = calculate_impact(event["date"], df)
    impacts.append(result.post_impact)
    # fig, ax = result.plot()
    # plt.savefig(f"plots/event_{i}.png")
impacts = np.array(impacts)
# plot the mean and the 95% confidence interval
plt.plot(impacts.mean(axis=0))
plt.fill_between(
    np.arange(impacts.shape[1]),
    impacts.mean(axis=0) - 2 * impacts.std(axis=0),
    impacts.mean(axis=0) + 2 * impacts.std(axis=0),
    alpha=0.3,
)
plt.savefig("plots/impact.png")
