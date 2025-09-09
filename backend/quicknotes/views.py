# backend/quicknotes/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action # Para crear acciones personalizadas en ViewSets
from rest_framework.response import Response
from django.db import connection, transaction # Para interactuar con la DB directamente y transacciones
from .serializers import UsuarioRegisterSerializer
from rest_framework import generics, permissions

from .models import Usuario, Cliente, Producto, Pedido, DetallePedido, Devolucion
from .serializers import (
    UsuarioSerializer, ClienteSerializer, ProductoSerializer,
    PedidoSerializer, DetallePedidoSerializer, DevolucionSerializer
)

# ViewSet para la gestión de usuarios
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('username')
    serializer_class = UsuarioSerializer
    # Puedes añadir permisos aquí si los necesitas:
    # permission_classes = [permissions.IsAuthenticated, CustomPermission]

# ViewSet para la gestión de clientes
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all().order_by('nombre')
    serializer_class = ClienteSerializer

# ViewSet para la gestión de productos
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('nombre')
    serializer_class = ProductoSerializer

# ViewSet para la gestión de pedidos
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha_pedido')
    serializer_class = PedidoSerializer

class UsuarioRegisterView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    permission_classes = (permissions.AllowAny,) # Permite a cualquiera registrarse
    serializer_class = UsuarioRegisterSerializer

    # Acción personalizada para registrar un pedido usando el PROCEDURE de PostgreSQL
    @action(detail=False, methods=['post'], url_path='registrar-nuevo-pedido')
    def registrar_nuevo_pedido(self, request):
        cliente_id = request.data.get('cliente_id')
        estado = request.data.get('estado', 'pendiente') # Por defecto 'pendiente'
        productos_data = request.data.get('productos', []) # Lista de {producto_id, cantidad, precio_unitario}

        if not cliente_id or not productos_data:
            return Response({'error': 'Cliente ID y datos de productos son requeridos.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Extraer los arrays para pasarlos al procedimiento
        p_productos_ids = [item['producto_id'] for item in productos_data]
        p_cantidades = [item['cantidad'] for item in productos_data]
        p_precios_unitarios = [item['precio_unitario'] for item in productos_data]

        try:
            with connection.cursor() as cursor:
                # Llama al procedure de PostgreSQL
                cursor.execute(
                    "CALL registrar_pedido(%s, %s, %s, %s, %s)",
                    [cliente_id, estado, p_productos_ids, p_cantidades, p_precios_unitarios]
                )
            return Response({'message': 'Pedido registrado exitosamente.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Captura cualquier error de la DB o del procedure
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Acción personalizada para obtener las ventas totales usando la FUNCTION de PostgreSQL
    @action(detail=False, methods=['get'], url_path='ventas-totales')
    def obtener_ventas_totales(self, request):
        try:
            with connection.cursor() as cursor:
                # Llama a la función de PostgreSQL
                cursor.execute("SELECT ventas_totales()")
                total = cursor.fetchone()[0] # Obtiene el primer (y único) resultado
            return Response({'ventas_totales': total}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ViewSet para la gestión de detalles de pedidos
class DetallePedidoViewSet(viewsets.ModelViewSet):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer

# ViewSet para la gestión de devoluciones
class DevolucionViewSet(viewsets.ModelViewSet):
    queryset = Devolucion.objects.all().order_by('-fecha_devolucion')
    serializer_class = DevolucionSerializer

    # Opcional: Si quieres un endpoint para aprobar/rechazar devoluciones y que el trigger actúe
    @action(detail=True, methods=['patch'], url_path='cambiar-estado')
    def cambiar_estado_devolucion(self, request, pk=None):
        devolucion = self.get_object()
        nuevo_estado = request.data.get('estado')

        if nuevo_estado not in ['solicitada', 'aprobada', 'rechazada', 'completada']:
            return Response({'error': 'Estado de devolución inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        devolucion.estado = nuevo_estado
        devolucion.save() # Al guardar, el trigger de DB (si está configurado) actuará si el estado es 'aprobada'
        serializer = self.get_serializer(devolucion)
        return Response(serializer.data)