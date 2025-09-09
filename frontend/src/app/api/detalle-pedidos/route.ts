import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateAndAuthorize } from '@/lib/auth';

// --- Handler para GET /api/detalle-pedidos ---
// Obtiene la lista de todos los detalles de pedidos.
// Protegido: Solo accesible para 'administrador' y 'empleado'.
export async function GET(req: NextRequest) {
  const { user, error } = await authenticateAndAuthorize(req, ['administrador', 'empleado']);
  if (error) {
    return error;
  }

  try {
    // Unimos las tablas para obtener nombres en lugar de solo IDs
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
      ORDER BY dp.pedido_id, dp.id;
    `;
    const result = await query(getDetailsQuery);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error al obtener detalles de pedidos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.', error: error.message },
      { status: 500 }
    );
  }
}

// --- Handler para POST /api/detalle-pedidos ---
// Crea un nuevo detalle de pedido.
// Protegido: Solo 'administrador' y 'empleado' pueden añadir items manualmente.
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
    
    // El TRIGGER se encargará de actualizar el stock
    // Aquí también podríamos recalcular y actualizar el total del pedido principal

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

    return NextResponse.json(
      { message: 'Detalle de pedido creado exitosamente.', detalle: result.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear el detalle del pedido:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.', error: error.message },
      { status: 500 }
    );
  }
}