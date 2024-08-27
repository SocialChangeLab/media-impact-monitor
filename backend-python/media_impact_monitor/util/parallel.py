from joblib import Parallel, delayed
from tqdm.auto import tqdm


def parallel_tqdm(
    func: callable,
    iter: list,
    total: int | None = None,
    n_jobs: int = 8,
    backend: str = "loky",
    **kwargs,
) -> list:
    """Parallelize a function with a tqdm progress bar."""
    total = total or len(iter)
    results = Parallel(n_jobs=n_jobs, return_as="generator", backend=backend)(
        delayed(func)(result) for result in iter
    )
    results = list(tqdm(results, miniters=1, total=total, **kwargs))
    return results
