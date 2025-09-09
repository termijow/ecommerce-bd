import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

// Definimos una interfaz para el payload del token para tener autocompletado y seguridad de tipos
interface UserPayload extends jose.JWTPayload {
  sub: string; // El ID del usuario
  username: string;
  rol: 'cliente' | 'empleado' | 'administrador';
}

/**
 * Middleware de autenticación y autorización.
 * Verifica el token JWT de la cabecera, valida su firma y rol.
 *
 * @param req La petición entrante.
 * @param allowedRoles Un array de roles permitidos para acceder a la ruta.
 * @returns Un objeto con el payload del usuario si es válido, o una respuesta de error.
 */
export async function authenticateAndAuthorize(
  req: NextRequest,
  allowedRoles: ('cliente' | 'empleado' | 'administrador')[]
): Promise<{ user?: UserPayload; error?: NextResponse }> {
  
  // 1. Obtener el token de la cabecera 'Authorization'
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1]; // Formato "Bearer <token>"

  if (!token) {
    return { error: NextResponse.json({ message: 'No se proporcionó un token de autenticación.' }, { status: 401 }) };
  }

  try {
    // 2. Verificar la firma y la validez del token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify<UserPayload>(token, secret);

    // 3. Verificar si el rol del usuario está en la lista de roles permitidos
    if (!allowedRoles.includes(payload.rol)) {
      return { error: NextResponse.json({ message: 'No tienes permiso para realizar esta acción.' }, { status: 403 }) };
    }

    // 4. Si todo es correcto, devolver el payload del usuario
    return { user: payload };

  } catch (error) {
    // Si el token es inválido (expirado, malformado, etc.)
    console.error('Error de autenticación JWT:', error);
    return { error: NextResponse.json({ message: 'Token inválido o expirado.' }, { status: 401 }) };
  }
}