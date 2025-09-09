import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateAndAuthorize } from '@/lib/auth'; // Importamos nuestro middleware

// --- Handler para GET /api/clientes ---
// Obtiene la lista de todos los clientes.
// Protegido: Solo accesible para 'administrador' y 'empleado'.
export async function GET(req: NextRequest) {
  // 1. Proteger la ruta: verificamos el token y el rol del usuario.
  const { user, error } = await authenticateAndAuthorize(req, ['administrador', 'empleado']);
  if (error) {
    return error; // Devuelve el error 401 o 403 si la autenticación falla.
  }

  try {
    // 2. Si la autenticación es exitosa, obtenemos los clientes.
    const getClientsQuery = 'SELECT * FROM clientes ORDER BY id ASC';
    const result = await query(getClientsQuery);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.', error: error.message },
      { status: 500 }
    );
  }
}

// --- Handler para POST /api/clientes ---
// Crea un nuevo cliente.
// Protegido: Solo accesible para 'administrador' y 'empleado'.
export async function POST(req: NextRequest) {
  // 1. Proteger la ruta.
  const { user, error } = await authenticateAndAuthorize(req, ['administrador', 'empleado']);
  if (error) {
    return error;
  }
  
  try {
    // 2. Obtener los datos del nuevo cliente.
    const { nombre, apellido, email, telefono, direccion } = await req.json();

    // 3. Validación de datos.
    if (!nombre || !apellido || !email) {
      return NextResponse.json(
        { message: 'Nombre, apellido y email son campos requeridos.' },
        { status: 400 }
      );
    }

    // 4. Insertar el nuevo cliente en la base de datos.
    const createClientQuery = `
      INSERT INTO clientes (nombre, apellido, email, telefono, direccion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await query(createClientQuery, [
      nombre,
      apellido,
      email,
      telefono,
      direccion,
    ]);

    // 5. Devolver el cliente recién creado.
    return NextResponse.json(
      { message: 'Cliente creado exitosamente.', cliente: result.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    // Manejo de errores, como un email duplicado.
    if (error.code === '23505') { // Código de error de PostgreSQL para violación de unicidad
        return NextResponse.json(
            { message: 'El email proporcionado ya está en uso.' },
            { status: 409 } // Conflict
        );
    }
    console.error('Error al crear el cliente:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.', error: error.message },
      { status: 500 }
    );
  }
}