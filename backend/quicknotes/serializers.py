# backend/quicknotes/serializers.py
from rest_framework import serializers
from .models import Note # Importa tu modelo Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        # Especifica los campos del modelo que quieres incluir en la API
        fields = ['id', 'title', 'content', 'created_at']