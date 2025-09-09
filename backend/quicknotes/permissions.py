from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permiso personalizado para permitir acceso solo a usuarios con el rol 'administrador'.
    """
    def has_permission(self, request, view):
        # Verifica que el usuario esté autenticado y que su rol sea 'administrador'
        return request.user and request.user.is_authenticated and request.user.rol == 'administrador'

class IsEmpleadoUser(permissions.BasePermission):
    """
    Permiso personalizado para permitir acceso a usuarios con rol 'empleado' o 'administrador'.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        # Verifica que el usuario esté autenticado y que su rol sea 'empleado' o 'administrador'
        return request.user.rol in ['empleado', 'administrador']

# Nota: No creamos un 'IsClienteUser' porque el permiso por defecto 'IsAuthenticated'
# de Django REST Framework ya cubre el caso de "cualquier usuario logueado".
# La lógica específica para clientes (ver solo sus propios datos) la manejaremos en las vistas.