from django.shortcuts import render, get_object_or_404
from .models import Event

def index(request):
    events = Event.objects.all()[:50]
    return render(request, "index.html", {"events": events})

def dashboard(request):
    return render(request, "dashboard.html")

def event_detail(request, event_id):
    event = get_object_or_404(Event, event_id=event_id)
    return render(request, "event_detail.html", {"event": event})

def organisations(request):
    return render(request, "organisations.html")

def about(request):
    return render(request, "about.html")

def docs(request):
    return render(request, "docs.html")


                  
