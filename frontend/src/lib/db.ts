import { Pool } from 'pg';

let pool: Pool;

// Verificamos que todas las variables de entorno necesarias estén presentes.
// Si alguna falta, lanzamos un error claro para saber qué falló.
if (!process.env.PGHOST || !process.env.PGUSER || !process.env.PGDATABASE || !process.env.PGPASSWORD) {
  throw new Error('Faltan variables de entorno para la conexión a la base de datos. Revisa tu archivo .env.local.');
}

// Creamos la configuración de la conexión de forma explícita.
const dbConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5432', 10),
  // Puedes añadir SSL aquí para producción si lo necesitas en el futuro
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Lógica para evitar múltiples conexiones en desarrollo (igual que antes)
if (process.env.NODE_ENV === 'production') {
  pool = new Pool(dbConfig);
} else {
  // @ts-ignore
  if (!global.db) {
    // @ts-ignore
    global.db = new Pool(dbConfig);
  }
  // @ts-ignore
  pool = global.db;
}

// La función 'query' se mantiene igual, pero ahora usa un 'pool' configurado explícitamente.
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};