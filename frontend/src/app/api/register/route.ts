import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Nombre de usuario, email y contraseña son requeridos.' },
        { status: 400 }
      );
    }

    const checkUserQuery = 'SELECT * FROM usuarios WHERE username = $1 OR email = $2';
    const existingUsers = await query(checkUserQuery, [username, email]);

    if (existingUsers.rows.length > 0) {
      return NextResponse.json(
        { message: 'El nombre de usuario o el email ya están en uso.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserQuery = `
      INSERT INTO usuarios (username, email, password, rol)
      VALUES ($1, $2, $3, 'cliente')
      RETURNING id, username, email, rol;
    `;
    
    const newUser = await query(createUserQuery, [username, email, hashedPassword]);

    return NextResponse.json(
      { message: 'Usuario creado exitosamente.', user: newUser.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { message: 'Ocurrió un error en el servidor.', error: error.message },
      { status: 500 }
    );
  }
}