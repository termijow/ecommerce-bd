import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateAndAuthorize } from '@/lib/auth'; // Usamos nuestro middleware (real o de demo)

// --- Handler para GET /api/detalle-pedidos ---
// Obtiene la lista de todos los detalles de pedidos.
// En modo demo, siempre funcionará.
export async function GET(req: NextRequest) {
  const { user, error } = await authenticateAndAuthorize(req, ['administrador', 'empleado']);
  if (error) {
    return error;
  }

  try {
    // Hacemos un JOIN para obtener los nombres de los productos, no solo sus IDs.
    const getDetailsQuery = `
      SELECT 
        dp.id,
        dp.pedido_id,
        p.nombre AS producto_nombre,
        dp.cantidad,
        dp.precio_unitario,
        dp.subtotal
      FROM detalle_pedidos dp
      JOIN productos p ON dp.producto_id = p.id
      ORDER BY dp.pedido_id ASC, dp.id ASC;
    `;
    const result = await query(getDetailsQuery);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error al obtener detalles de pedidos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener detalles.', error: error.message },
      { status: 500 }
    );
  }
}

// --- Handler para POST /api/detalle-pedidos ---
// Crea un nuevo detalle de pedido.
// Útil para que un administrador pueda añadir un producto a un pedido existente.
export async function POST(req: NextRequest) {
  const { user, error } = await authenticateAndAuthorize(req, ['administrador', 'empleado']);
  if (error) {
    return error;
  }
  
  try {
    const { pedido_id, producto_id, cantidad, precio_unitario } = await req.json();

    if (!pedido_id || !producto_id || !cantidad || precio_unitario === undefined) {
      return NextResponse.json({ message: 'Todos los campos son requeridos.' }, { status: 400 });
    }
    
    // El TRIGGER 'actualizar_stock' se activará automáticamente por este INSERT.
    const subtotal = cantidad * precio_unitario;
    
    const createDetailQuery = `
      INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await query(createDetailQuery, [
      pedido_id,
      producto_id,
      cantidad,
      precio_unitario,
      subtotal
    ]);
    
    // Adicional: Actualizar el total del pedido principal.
    const updateTotalQuery = `
        UPDATE pedidos
        SET total = (SELECT SUM(subtotal) FROM detalle_pedidos WHERE pedido_id = $1)
        WHERE id = $1;
    `;
    await query(updateTotalQuery, [pedido_id]);


    return NextResponse.json(
      { message: 'Detalle de pedido creado exitosamente.', detalle: result.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear el detalle del pedido:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al crear detalle.', error: error.message },
      { status: 500 }
    );
  }
}