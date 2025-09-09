from rest_framework import serializers
from .models import Usuario, Cliente, Producto, Pedido, DetallePedido, Devolucion
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# --- Serializadores de Modelos Principales ---

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol', 'first_name', 'last_name']

class ClienteSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    class Meta:
        model = Cliente
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ['id', 'fecha_creacion']

    def validate_precio(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser un número negativo.")
        return value

class DetallePedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    class Meta:
        model = DetallePedido
        fields = ['id', 'pedido', 'producto', 'producto_nombre', 'cantidad', 'precio_unitario', 'subtotal']
        read_only_fields = ['id', 'subtotal']

class PedidoSerializer(serializers.ModelSerializer):
    detalle_pedidos = DetallePedidoSerializer(many=True, read_only=True, source='detallepedido_set')
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'cliente_nombre', 'fecha_pedido', 'estado', 'total', 'detalle_pedidos']
        read_only_fields = ['id', 'fecha_pedido', 'total']

class DevolucionSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    pedido_id = serializers.IntegerField(source='pedido.id', read_only=True)
    class Meta:
        model = Devolucion
        fields = '__all__'
        read_only_fields = ['id', 'fecha_devolucion']

# --- Serializadores de Autenticación ---

class UsuarioRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, label='Confirmar contraseña')

    class Meta:
        model = Usuario
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, attrs):
        print("--- DEBUG: Entrando a validate() ---")
        print(f"--- DEBUG: Datos recibidos: {attrs} ---")
        if attrs['password'] != attrs['password2']:
            print("--- DEBUG: ERROR - Las contraseñas no coinciden ---")
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        print("--- DEBUG: La validación fue exitosa ---")
        return attrs

def create(self, validated_data):
    print("--- DEBUG (Registro): Usando el método create a prueba de balas ---")
    # Removemos las contraseñas para manejarlas por separado
    validated_data.pop('password2')
    password = validated_data.pop('password')
    
    # Creamos la instancia sin guardar
    user = Usuario(**validated_data)
    # Establecemos la contraseña (esto la encripta)
    user.set_password(password)
    # Forzamos el estado activo
    user.is_active = True
    # Guardamos el objeto completo
    user.save()
    
    print(f"--- DEBUG (Registro): Usuario '{user.username}' guardado. Activo: {user.is_active}")
    return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador de token personalizado para depurar y traducir mensajes.
    """
    default_error_messages = {
        'no_active_account': 'No se encontró ninguna cuenta activa con las credenciales proporcionadas.'
    }

    def validate(self, attrs):
        # --- PUNTO DE DEPURACIÓN DEL BACKEND ---
        print("--- DEBUG (Login): Datos recibidos por el serializador ---")
        print(attrs)
        print("---------------------------------------------------------")
        
        # Continuamos con la validación original de la librería
        data = super().validate(attrs)
        
        print("--- DEBUG (Login): La validación fue exitosa, generando tokens ---")
        return data