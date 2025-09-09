import { NextResponse } from 'next/server';
import { query } from '@/lib/db';         // Nuestra función para conectar a la BD
import bcrypt from 'bcryptjs';            // Para comparar contraseñas encriptadas
import * as jose from 'jose';             // Para crear los JSON Web Tokens (JWT)

/**
 * Maneja las peticiones POST para el inicio de sesión de usuarios.
 * Recibe un nombre de usuario/email y una contraseña, los verifica, y si son
 * correctos, devuelve un token de acceso JWT.
 */
export async function POST(req: Request) {
  try {
    // 1. Obtener las credenciales del cuerpo de la petición.
    const { username, password } = await req.json();

    // 2. Validación básica de entrada.
    if (!username || !password) {
      return NextResponse.json(
        { message: 'El nombre de usuario y la contraseña son requeridos.' },
        { status: 400 } // Bad Request
      );
    }

    // 3. Buscar al usuario en la base de datos.
    // Buscamos tanto en la columna 'username' como en 'email' para más flexibilidad.
    const findUserQuery = 'SELECT * FROM usuarios WHERE username = $1 OR email = $1';
    const userResult = await query(findUserQuery, [username]);

    // 4. Si no se encuentra ningún usuario, devolvemos un error.
    // Es importante usar un mensaje genérico para no dar pistas a atacantes.
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Credenciales inválidas.' },
        { status: 401 } // Unauthorized
      );
    }

    const user = userResult.rows[0];

    // 5. Comparar la contraseña enviada con la contraseña encriptada (hash) guardada en la BD.
    // bcrypt.compare se encarga de todo el proceso de forma segura.
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json(
        { message: 'Credenciales inválidas.' },
        { status: 401 } // Unauthorized
      );
    }

    // ¡ÉXITO! Las credenciales son correctas. Ahora generamos el token.

    // 6. Preparar la clave secreta para firmar el token.
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    // 7. Definir el 'payload': la información que viajará dentro del token.
    // Esta información es pública (pero no modificable), así que no incluyas datos sensibles.
    const payload = {
      sub: user.id, // 'sub' (subject) es el estándar para el ID del usuario
      username: user.username,
      rol: user.rol,
    };
    
    // 8. Crear y firmar el token JWT.
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' }) // Algoritmo de encriptación
      .setIssuedAt()                         // Fecha de creación
      .setExpirationTime('1h')               // Tiempo de vida (ej. 1 hora)
      .sign(secret);                         // Firmar con nuestra clave secreta

    // 9. Devolver una respuesta exitosa con el token.
    return NextResponse.json({
      message: 'Inicio de sesión exitoso.',
      token: token,
    });

  } catch (error: any) {
    // Manejo de cualquier error inesperado que ocurra en el proceso.
    console.error('Error en el endpoint de inicio de sesión:', error);
    return NextResponse.json(
      { message: 'Ocurrió un error en el servidor.', error: error.message },
      { status: 500 }
    );
  }
}