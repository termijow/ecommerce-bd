# backend/quicknotes/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

# Modelo para los usuarios del sistema (ya corregido)
class Usuario(AbstractUser):
    rol = models.CharField(max_length=20, default='cliente')

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuario_groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuario_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.username

# --- ASEGÚRATE DE QUE ESTOS MODELOS TAMBIÉN ESTÉN PRESENTES ---

# Modelo para los datos de clientes
class Cliente(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

# Modelo para productos y/o servicios
class Producto(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(null=True, blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

# Modelo para guardar datos de pedidos
class Pedido(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50, default='pendiente')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Pedido #{self.id}"

# Modelo de detalle para los pedidos
class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.RESTRICT)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Detalle {self.id} - Pedido {self.pedido.id}"

# Modelo donde se manejen devoluciones
class Devolucion(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.RESTRICT)
    cantidad = models.IntegerField()
    fecha_devolucion = models.DateTimeField(auto_now_add=True)
    motivo = models.TextField(null=True, blank=True)
    estado = models.CharField(max_length=50, default='solicitada')

    def __str__(self):
        return f"Devolución #{self.id}"