# backend/quicknotes/serializers.py
from rest_framework import serializers
from .models import Usuario, Cliente, Producto, Pedido, DetallePedido, Devolucion

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ['id', 'fecha_creacion']

    # --- VALIDACIÓN AÑADIDA ---
    def validate_precio(self, value):
        """
        Verifica que el precio no sea negativo.
        """
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo.")
        return value

    def validate_stock(self, value):
        """
        Verifica que el stock no sea negativo.
        """
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser un número negativo.")
        return value

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

# ... (al final del archivo, después de DevolucionSerializer)

class UsuarioRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, label='Confirm password')

    class Meta:
        model = Usuario
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        # Usamos create_user para hashear la contraseña correctamente
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user