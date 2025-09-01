# backend/quicknotes/views.py
from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer

class NoteViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows notes to be viewed or edited.
    """
    queryset = Note.objects.all().order_by('-created_at') # Devuelve todas las notas, las más nuevas primero
    serializer_class = NoteSerializer