from django.contrib.auth import backends, get_user_model
from django.db.models import Q

UserModel = get_user_model()

class EmailBackend(backends.ModelBackend):
    """
    Backend de autenticación personalizado que permite a los usuarios
    iniciar sesión usando su dirección de correo electrónico o su nombre de usuario,
    ignorando mayúsculas y minúsculas.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # --- ¡LA CLAVE ESTÁ AQUÍ! ---
            # Buscamos un usuario donde el 'username' O el 'email' coincidan
            # con lo que el usuario escribió en el formulario de login.
            # 'iexact' significa 'exactamente igual, pero ignorando mayúsculas/minúsculas'.
            user = UserModel.objects.get(
                Q(username__iexact=username) | Q(email__iexact=username)
            )
        except UserModel.DoesNotExist:
            # Si no se encuentra ningún usuario con ese username o email, paramos.
            return None
        except UserModel.MultipleObjectsReturned:
            # En el caso improbable de que haya duplicados, priorizamos el username.
            return UserModel.objects.filter(username__iexact=username).first()

        # Si encontramos un usuario, verificamos su contraseña y si su cuenta está activa.
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        
        return None