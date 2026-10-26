import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env['DB_HOST'] || '127.0.0.1',
  port: Number(process.env['DB_PORT'] || 5432),
  user: process.env['DB_USER'] || 'postgres',
  password: process.env['DB_PASSWORD'] ? process.env['DB_PASSWORD'] : undefined,
  database: process.env['DB_NAME'] || 'mueblesjs',
});

pool.on('error', (err: Error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);
