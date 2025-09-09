from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# --- ¡CAMBIO IMPORTANTE! ---
# Ya no importamos TokenObtainPairView, sino nuestra propia vista
from rest_framework_simplejwt.views import TokenRefreshView
from quicknotes.views import UsuarioRegisterView, MyTokenObtainPairView # <-- Añadir MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('quicknotes.urls')),

    # --- URLs de Autenticación ---
    path('api/register/', UsuarioRegisterView.as_view(), name='auth_register'),
    
    # --- ¡CAMBIO IMPORTANTE! ---
    # Usamos nuestra vista personalizada en lugar de la que viene por defecto
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- URLs de Documentación ---
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
]