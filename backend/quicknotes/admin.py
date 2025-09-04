# backend/quicknotes/admin.py

from django.contrib import admin
from .models import Usuario, Cliente, Producto, Pedido, DetallePedido, Devolucion

# Registra tus modelos aquí para que aparezcan en el sitio de administración de Django
admin.site.register(Usuario)
admin.site.register(Cliente)
admin.site.register(Producto)
admin.site.register(Pedido)
admin.site.register(DetallePedido)
admin.site.register(Devolucion)