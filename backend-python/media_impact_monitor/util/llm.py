from functools import partial

import litellm

from media_impact_monitor.util.cache import cache
from media_impact_monitor.util.env import (
    AZURE_API_BASE,
    AZURE_API_KEY,
    AZURE_API_VERSION,
)

completion = partial(
    cache(litellm.completion),
    model="azure/gpt-35-turbo",  # model = azure/<your-azure-deployment-name>
    api_base=AZURE_API_BASE,
    api_version=AZURE_API_VERSION,
    api_key=AZURE_API_KEY,
)
