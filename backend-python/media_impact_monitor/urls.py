from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("event/<event_id>", views.event_detail, name="event detail")
]
