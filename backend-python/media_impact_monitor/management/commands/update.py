from datetime import date, timedelta

from django.core.management.base import BaseCommand
from media_impact_monitor.data_loaders.protest.acled.acled import get_acled_events
from media_impact_monitor.models import Event
import numpy as np

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        yesterday = date.today() - timedelta(days=1)
        df = get_acled_events(
            start_date=date(2024, 1, 1),
            end_date=yesterday,
            countries=["Germany"],
        )
        events = df.replace({np.nan:None}).to_dict(orient="records")
        for event in events:
            event = Event(**event)
            if not Event.objects.filter(event_id=event.event_id).exists():
                event.save()



