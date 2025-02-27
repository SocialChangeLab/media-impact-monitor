from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("dashboard", views.dashboard, name="dashboard"),
    path("organisations", views.organisations, name="organisations"),
    path("about", views.about, name="about"),
    path("docs", views.docs, name="docs"),
    path("event/<event_id>", views.event_detail, name="event detail"),
    path("api/newsletter/subscribe", views.newsletter_subscribe, name="newsletter_subscribe"),
]
