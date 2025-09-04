# backend/core/urls.py
from django.contrib import admin
from django.urls import path, include
# Importar las vistas de spectacular
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('quicknotes.urls')),

    # --- Rutas de Documentación de la API ---
    # Descarga el archivo schema.yml
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Interfaz de usuario de Swagger (la que usarás)
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Interfaz opcional de ReDoc
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]