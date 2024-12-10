from datetime import date, timedelta

import numpy as np
from django.core.management.base import BaseCommand

from media_impact_monitor.events import get_events
from media_impact_monitor.models import Event
from media_impact_monitor.types_ import EventSearch


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        Event.objects.all().delete() # TODO
        yesterday = date.today() - timedelta(days=1)
        df = get_events(
            EventSearch(
                start_date=date(2024, 1, 1),
                end_date=yesterday,
                topic="climate_change",
                source="acled",
            )
        )
        events = df.replace({np.nan: None}).to_dict(orient="records")
        for event in events:
            event = Event(**event)
            if not Event.objects.filter(event_id=event.event_id).exists():
                event.save()
