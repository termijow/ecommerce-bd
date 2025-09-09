import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateAndAuthorize } from '@/lib/auth'; // Importamos nuestro middleware

// --- Handler para GET /api/productos ---
// Obtiene la lista de todos los productos. Es una ruta pública.
export async function GET() {
  try {
    const getProductsQuery = 'SELECT * FROM productos WHERE activo = TRUE ORDER BY id ASC';
    const result = await query(getProductsQuery);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.', error: error.message },
      { status: 500 }
    );
  }
}

// --- Handler para POST /api/productos ---
// Crea un nuevo producto. Es una ruta protegida solo para administradores.
export async function POST(req: NextRequest) {
  // 1. Ejecutar nuestro middleware de autenticación y autorización
  // Solo permitimos el acceso a usuarios con el rol 'administrador'
  const { user, error } = await authenticateAndAuthorize(req, ['administrador']);

  // Si el middleware devuelve un error (token inválido, sin permisos, etc.),
  // lo devolvemos directamente.
  if (error) {
    return error;
  }
  
  // Si llegamos aquí, significa que el usuario está autenticado y es un administrador.
  // El payload del usuario está disponible en la variable 'user'.
  console.log(`Usuario administrador '${user?.username}' está creando un producto.`);

  try {
    // 2. Obtener los datos del nuevo producto del cuerpo de la petición
    const { nombre, descripcion, precio, stock, activo } = await req.json();

    // 3. Validación de datos
    if (!nombre || precio === undefined || stock === undefined) {
      return NextResponse.json(
        { message: 'Nombre, precio y stock son campos requeridos.' },
        { status: 400 }
      );
    }
    if (precio < 0 || stock < 0) {
      return NextResponse.json(
        { message: 'El precio y el stock no pueden ser negativos.' },
        { status: 400 }
      );
    }

    // 4. Insertar el nuevo producto en la base de datos
    const createProductQuery = `
      INSERT INTO productos (nombre, descripcion, precio, stock, activo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await query(createProductQuery, [
      nombre,
      descripcion,
      precio,
      stock,
      activo !== undefined ? activo : true,
    ]);

    // 5. Devolver el producto recién creado
    return NextResponse.json(
      { message: 'Producto creado exitosamente.', producto: result.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear el producto:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.', error: error.message },
      { status: 500 }
    );
  }
}