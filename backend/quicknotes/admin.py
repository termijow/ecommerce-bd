# backend/quicknotes/admin.py
from django.contrib import admin
from .models import Note # Importa tu modelo Note

admin.site.register(Note) # Registra el modelo Note con el sitio de admin