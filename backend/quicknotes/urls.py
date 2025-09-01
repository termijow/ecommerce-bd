# backend/quicknotes/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet # Importa tu ViewSet

# Crea un router y registra nuestro ViewSet con él.
router = DefaultRouter()
# 'notes' será el prefijo para las URLs de este ViewSet (ej: /api/quicknotes/notes/)
router.register(r'notes', NoteViewSet, basename='note')

# Las URLs de la API son ahora determinadas automáticamente por el router.
urlpatterns = [
    path('', include(router.urls)),
]