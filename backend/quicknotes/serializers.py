# backend/quicknotes/serializers.py
from rest_framework import serializers
from .models import Usuario, Cliente, Producto, Pedido, DetallePedido, Devolucion

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol', 'first_name', 'last_name']
        read_only_fields = ['id'] # El ID se genera automáticamente

class ClienteSerializer(serializers.ModelSerializer):
    # Serializador anidado para mostrar los datos del usuario asociado (si existe)
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Cliente
        fields = '__all__' # Incluye todos los campos del modelo
        read_only_fields = ['id']

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ['id', 'fecha_creacion']

class DetallePedidoSerializer(serializers.ModelSerializer):
    # Para mostrar el nombre del producto en el detalle del pedido
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = DetallePedido
        fields = ['id', 'pedido', 'producto', 'producto_nombre', 'cantidad', 'precio_unitario', 'subtotal']
        read_only_fields = ['id', 'subtotal'] # Subtotal se calcula en el modelo o en el backend

class PedidoSerializer(serializers.ModelSerializer):
    # Para mostrar los detalles del pedido anidados
    detalle_pedidos = DetallePedidoSerializer(many=True, read_only=True, source='detallepedido_set')
    # Para mostrar el nombre del cliente
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'cliente_nombre', 'fecha_pedido', 'estado', 'total', 'detalle_pedidos']
        read_only_fields = ['id', 'fecha_pedido', 'total'] # El total se calcula en el procedure/backend

class DevolucionSerializer(serializers.ModelSerializer):
    # Para mostrar el nombre del producto y el pedido asociado
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    pedido_id = serializers.IntegerField(source='pedido.id', read_only=True)

    class Meta:
        model = Devolucion
        fields = '__all__'
        read_only_fields = ['id', 'fecha_devolucion']