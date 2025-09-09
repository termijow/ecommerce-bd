import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateAndAuthorize } from '@/lib/auth';

// --- Handler para GET /api/pedidos ---
export async function GET(req: NextRequest) {
  const { user, error } = await authenticateAndAuthorize(req, ['cliente', 'empleado', 'administrador']);
  if (error) {
    return error;
  }

  try {
    let getPedidosQuery;
    let queryParams = [];

    // Lógica de roles: Admins/Empleados ven todo, Clientes solo lo suyo
    if (user?.rol === 'administrador' || user?.rol === 'empleado') {
      getPedidosQuery = `
        SELECT p.id, p.cliente_id, c.nombre || ' ' || c.apellido AS cliente_nombre, p.fecha_pedido, p.estado, p.total
        FROM pedidos p
        JOIN clientes c ON p.cliente_id = c.id
        ORDER BY p.fecha_pedido DESC;
      `;
    } else {
      // Un cliente solo puede ver sus propios pedidos.
      // Necesitamos encontrar el ID del cliente asociado a este usuario.
      const clienteResult = await query('SELECT id FROM clientes WHERE usuario_id = $1', [user?.sub]);
      if (clienteResult.rows.length === 0) {
        // Este usuario no tiene un perfil de cliente asociado
        return NextResponse.json([]);
      }
      const clienteId = clienteResult.rows[0].id;
      
      getPedidosQuery = `
        SELECT p.id, p.cliente_id, c.nombre || ' ' || c.apellido AS cliente_nombre, p.fecha_pedido, p.estado, p.total
        FROM pedidos p
        JOIN clientes c ON p.cliente_id = c.id
        WHERE p.cliente_id = $1
        ORDER BY p.fecha_pedido DESC;
      `;
      queryParams.push(clienteId);
    }
    
    const result = await query(getPedidosQuery, queryParams);
    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

// Nota: El POST para crear un pedido está en un endpoint separado para llamar al procedure
// Lo crearemos en /api/pedidos/registrar/route.ts