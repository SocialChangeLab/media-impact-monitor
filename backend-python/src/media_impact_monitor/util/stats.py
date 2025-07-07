import numpy as np
import scipy.stats


def confidence_interval_ttest(data: list[float], confidence: float):
    # TODO: check for normality
    return scipy.stats.t.interval(
        confidence, len(data) - 1, loc=np.mean(data), scale=scipy.stats.sem(data)
    )


def confidence_interval_bootstrap(data: list[float], confidence: float, n_iter: int):
    raise NotImplementedError
