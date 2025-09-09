// Obtenemos la URL base de las variables de entorno.
// Si no está definida, usamos '/api' por defecto.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Creamos un objeto que contendrá todas nuestras URLs de la API.
export const apiUrls = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
  productos: `${API_BASE_URL}/productos`,
  clientes: `${API_BASE_URL}/clientes`,
  pedidos: `${API_BASE_URL}/pedidos`,
  detalles: `${API_BASE_URL}/detalle-pedidos`, // <-- ¡AÑADIR ESTA LÍNEA!
};;

// Función de ayuda para obtener las cabeceras de autenticación.
// Ahora está centralizada y la podemos reusar.
export const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    // Si estamos en el servidor, no hay localStorage
    return null;
  }
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return null;
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};