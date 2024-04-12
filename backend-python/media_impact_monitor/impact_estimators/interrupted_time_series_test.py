from datetime import date

import matplotlib.pyplot as plt
import numpy as np
from tqdm.auto import tqdm

from media_impact_monitor.data_loaders.news_online.mediacloud_ import (
    get_mediacloud_counts,
)
from media_impact_monitor.data_loaders.news_print.genios import get_genios_counts
from media_impact_monitor.data_loaders.protest.acled import get_acled_events
from media_impact_monitor.impact_estimators.interrupted_time_series import (
    calculate_impacts,
)

# get events and article counts for "Last Generation (Germany)" in 2023
events = get_acled_events(
    countries=["Germany"], start_date=date(2023, 6, 1), end_date=date(2024, 2, 29)
)
events = events[
    events["organizations"].apply(lambda x: "Last Generation (Germany)" in x)
]
# events = events.sample(100)
article_counts = get_mediacloud_counts(
    '"Letzte Generation"', date(2023, 1, 1), date(2024, 3, 31)
)

# estimate impact for each event
actuals, counterfactuals, impacts = calculate_impacts(events, article_counts)

# plot the mean and the 95% confidence interval
# a) comparison of actual and counterfactual media coverage
fig, ax = plt.subplots()
plt.plot(actuals.mean(axis=0))
plt.plot(counterfactuals.mean(axis=0))
plt.fill_between(
    np.arange(actuals.shape[1]),
    actuals.mean(axis=0) - 2 * actuals.std(axis=0),
    actuals.mean(axis=0) + 2 * actuals.std(axis=0),
    alpha=0.3,
)
plt.fill_between(
    np.arange(counterfactuals.shape[1]),
    counterfactuals.mean(axis=0) - 2 * counterfactuals.std(axis=0),
    counterfactuals.mean(axis=0) + 2 * counterfactuals.std(axis=0),
    alpha=0.3,
)
plt.savefig("plots/comparison.png")
# b) impact of the protest events (= actual - counterfactual media coverage)
fig, ax = plt.subplots()
plt.plot(impacts.mean(axis=0))
plt.fill_between(
    np.arange(impacts.shape[1]),
    impacts.mean(axis=0) - 2 * impacts.std(axis=0),
    impacts.mean(axis=0) + 2 * impacts.std(axis=0),
    alpha=0.3,
)
plt.savefig("plots/impact.png")
