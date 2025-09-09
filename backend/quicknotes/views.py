from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import connection

from .models import Usuario, Cliente, Producto, Pedido, DetallePedido, Devolucion
from .serializers import (
    UsuarioSerializer, ClienteSerializer, ProductoSerializer,
    PedidoSerializer, DetallePedidoSerializer, DevolucionSerializer,
    UsuarioRegisterSerializer
)
# --- ¡IMPORTANTE! Importar los permisos que acabamos de crear ---
from .permissions import IsAdminUser, IsEmpleadoUser

class UsuarioRegisterView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UsuarioRegisterSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('username')
    serializer_class = UsuarioSerializer
    # Solo los administradores pueden gestionar usuarios
    permission_classes = [IsAdminUser]

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all().order_by('nombre')
    serializer_class = ClienteSerializer
    # Empleados y administradores pueden gestionar clientes
    permission_classes = [IsEmpleadoUser]

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('nombre')
    serializer_class = ProductoSerializer
    
    def get_permissions(self):
        """
        Asigna permisos basados en la acción.
        - Cualquiera logueado puede ver la lista de productos (list, retrieve).
        - Solo los administradores pueden crear, editar o borrar productos.
        """
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

class PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer
    # Cualquier usuario autenticado puede interactuar con este endpoint
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filtra los pedidos para que los clientes solo vean los suyos,
        mientras que los empleados y administradores ven todos.
        """
        user = self.request.user
        if user.rol in ['administrador', 'empleado']:
            return Pedido.objects.all().order_by('-fecha_pedido')
        
        # Para los clientes, filtramos por el cliente asociado a su usuario
        # Esto asume que existe un 'Cliente' enlazado al 'Usuario' logueado
        try:
            cliente = Cliente.objects.get(usuario=user)
            return Pedido.objects.filter(cliente=cliente).order_by('-fecha_pedido')
        except Cliente.DoesNotExist:
            # Si el usuario es un cliente pero no tiene un perfil de cliente, no devuelve nada
            return Pedido.objects.none()

    @action(detail=False, methods=['post'], url_path='registrar-nuevo-pedido')
    def registrar_nuevo_pedido(self, request):
        cliente_id = request.data.get('cliente_id')
        estado = request.data.get('estado', 'pendiente')
        productos_data = request.data.get('productos', [])

        if not cliente_id or not productos_data:
            return Response({'error': 'ID de cliente y lista de productos son requeridos.'},
                            status=status.HTTP_400_BAD_REQUEST)

        p_productos_ids = [item['producto_id'] for item in productos_data]
        p_cantidades = [item['cantidad'] for item in productos_data]
        p_precios_unitarios = [item['precio_unitario'] for item in productos_data]

        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "CALL registrar_pedido(%s, %s, %s, %s, %s)",
                    [cliente_id, estado, p_productos_ids, p_cantidades, p_precios_unitarios]
                )
            return Response({'message': 'Pedido registrado exitosamente.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='ventas-totales')
    def obtener_ventas_totales(self, request):
        # Solo empleados y admins pueden ver las ventas totales
        if request.user.rol not in ['administrador', 'empleado']:
            return Response({'detail': 'No tienes permiso para realizar esta acción.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT ventas_totales()")
                total = cursor.fetchone()[0]
            return Response({'ventas_totales': total}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DetallePedidoViewSet(viewsets.ModelViewSet):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer
    # Solo empleados y administradores pueden ver los detalles de todos los pedidos
    permission_classes = [IsEmpleadoUser]

class DevolucionViewSet(viewsets.ModelViewSet):
    queryset = Devolucion.objects.all().order_by('-fecha_devolucion')
    serializer_class = DevolucionSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Aquí también podrías añadir lógica en get_queryset para que los clientes
    # solo vean sus propias devoluciones.