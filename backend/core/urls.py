# backend/core/urls.py
from django.contrib import admin
from django.urls import path, include # Asegúrate de que 'include' esté importado

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/quicknotes/', include('quicknotes.urls')), # <--- AÑADE ESTA LÍNEA
    # ... cualquier otra URL principal que tengas
]