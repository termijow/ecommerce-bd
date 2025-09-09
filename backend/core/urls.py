from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
# Importaciones para JWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from quicknotes.views import UsuarioRegisterView # Importar la vista de registro

urlpatterns = [
    path('admin/', admin.site.urls),
    # URLs de tu API principal
    path('api/', include('quicknotes.urls')),

    # --- URLs de Autenticación ---
    path('api/register/', UsuarioRegisterView.as_view(), name='auth_register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- URLs de Documentación ---
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # --- ESTA ES LA LÍNEA CORREGIDA ---
    # Movimos name='schema' de as_view() a la función path()
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
]