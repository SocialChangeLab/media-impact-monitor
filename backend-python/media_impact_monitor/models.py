from django.db import models


class Event(models.Model):
    event_id = models.CharField(primary_key=True, max_length=255, unique=True)
    event_type = models.CharField(max_length=255)
    source = models.CharField(max_length=255, help_text="The source dataset.")
    date = models.DateField()
    country = models.CharField(max_length=255)
    region = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    organizers = models.JSONField()  # Will store the list of strings
    size_text = models.CharField(
        max_length=255, null=True, blank=True, help_text="Size of the event, in words."
    )
    size_number = models.IntegerField(
        null=True, blank=True, help_text="Size of the event, quantified if possible."
    )
    description = models.TextField()
    organizer_aliases = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.event_type} on {self.date} in {self.city or self.region or self.country or 'Unknown location'}"
