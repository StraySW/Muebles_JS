import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT']),
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'] ? process.env['DB_PASSWORD'] : undefined,
  database: process.env['DB_NAME'],
});

pool.on('error', (err: Error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);
