import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Event
from django.db.models import Count
from datetime import datetime, timedelta

def index(request):
    events = Event.objects.all()[:50]
    return render(request, "index.html", {"events": events})

def dashboard(request):
    # Get events from the last year
    one_year_ago = datetime.now() - timedelta(days=365)
    events = Event.objects.filter(date__gte=one_year_ago).values(
        'date',
        "city",
        'organizers',
        'size_number',
        "description"
    ).order_by('date')
    
    # Convert datetime to string format
    events_list = [
        {**event,
         'date': event["date"].strftime('%Y-%m-%d')}
        for event in events
        if len(event["organizers"]) > 0 # HACK
    ]
    
    return render(request, "dashboard.html", {
        "events": json.dumps(events_list),
    })

def event_detail(request, event_id):
    event = get_object_or_404(Event, event_id=event_id)
    return render(request, "event_detail.html", {"event": event})

def organisations(request):
    return render(request, "organisations.html")

def about(request):
    return render(request, "about.html")

def docs(request):
    return render(request, "docs.html")

@csrf_exempt
def newsletter_subscribe(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            # Validate email (basic validation)
            if not email or '@' not in email:
                return JsonResponse({'error': 'Please enter a valid email address'})
            
            # In a real application, you would save the email to a database or send it to a newsletter service
            # For now, we'll just return a success message
            
            return JsonResponse({'message': 'Successfully subscribed to the newsletter!'})
        except Exception as e:
            return JsonResponse({'error': str(e)})
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


                  
