import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Hacemos una consulta muy simple a PostgreSQL para obtener la hora actual del servidor.
    const result = await query('SELECT NOW()');
    
    // Si la consulta es exitosa, significa que estamos conectados.
    // Devolvemos un mensaje de éxito y la hora de la base de datos.
    return NextResponse.json(
      { 
        message: '¡Conexión a la base de datos exitosa!',
        databaseTime: result.rows[0].now 
      },
      { status: 200 } // OK
    );
  } catch (error: any) {
    // Si la consulta falla, algo está mal con la conexión o las credenciales.
    // Imprimimos el error en la consola del servidor para poder depurarlo.
    console.error('Error de conexión a la base de datos:', error);
    
    // Devolvemos un mensaje de error claro al navegador.
    return NextResponse.json(
      { 
        message: 'Error al conectar con la base de datos.',
        errorDetails: error.message
      },
      { status: 500 } // Internal Server Error
    );
  }
}