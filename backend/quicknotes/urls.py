from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, ClienteViewSet, ProductoViewSet, PedidoViewSet,
    DetallePedidoViewSet, DevolucionViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'productos', ProductoViewSet)

# --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
# Como PedidoViewSet usa get_queryset(), debemos especificar el basename manualmente.
router.register(r'pedidos', PedidoViewSet, basename='pedido')
# ------------------------------------

router.register(r'detalle-pedidos', DetallePedidoViewSet)
router.register(r'devoluciones', DevolucionViewSet)

# Las URLs generadas por el router
urlpatterns = router.urls