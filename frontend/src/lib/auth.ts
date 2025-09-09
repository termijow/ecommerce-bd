import { NextRequest, NextResponse } from 'next/server';

// Definimos la estructura de un usuario para que el resto del código no falle.
interface UserPayload {
  sub: string;
  username: string;
  rol: 'cliente' | 'empleado' | 'administrador';
}

/**
 * ¡¡¡MODO DEMO!!!
 * Esta es una función de autenticación FALSA.
 * No verifica ningún token. Simplemente devuelve un usuario administrador por defecto.
 * Esto permite acceder a todas las rutas protegidas sin necesidad de un login real.
 */
export async function authenticateAndAuthorize(
  req: NextRequest,
  allowedRoles: ('cliente' | 'empleado' | 'administrador')[]
): Promise<{ user?: UserPayload; error?: NextResponse }> {
  
  console.log('--- MODO DEMO: Saltando autenticación. Asignando rol de administrador. ---');

  // Creamos un usuario falso de tipo administrador.
  const demoUser: UserPayload = {
    sub: '1', // ID de usuario de demo
    username: 'admin_demo',
    rol: 'administrador', // ¡El rol más poderoso para la demo!
  };

  // Siempre devolvemos el usuario de demo, sin errores.
  return { user: demoUser };
}