# backend/quicknotes/urls.py
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, ClienteViewSet, ProductoViewSet, PedidoViewSet,
    DetallePedidoViewSet, DevolucionViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'detalle-pedidos', DetallePedidoViewSet)
router.register(r'devoluciones', DevolucionViewSet)

# Las URLs generadas por el router
urlpatterns = router.urls