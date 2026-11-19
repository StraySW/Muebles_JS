import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env['DATABASE_URL'] || process.env['DATABASE_PUBLIC_URL'];

const isRemoteOrProduction =
  process.env['NODE_ENV'] === 'production' ||
  Boolean(process.env['RAILWAY_ENVIRONMENT']) ||
  (Boolean(process.env['DB_HOST']) && process.env['DB_HOST'] !== 'localhost' && process.env['DB_HOST'] !== '127.0.0.1');

const sslOption = isRemoteOrProduction ? { rejectUnauthorized: false } : undefined;

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: sslOption,
    })
  : new Pool({
      host: process.env['DB_HOST'] || process.env['PGHOST'] || 'localhost',
      port: Number(process.env['DB_PORT'] || process.env['PGPORT'] || 5432),
      user: process.env['DB_USER'] || process.env['PGUSER'] || 'postgres',
      password: process.env['DB_PASSWORD'] || process.env['PGPASSWORD'] ? String(process.env['DB_PASSWORD'] || process.env['PGPASSWORD']) : undefined,
      database: process.env['DB_NAME'] || process.env['PGDATABASE'] || 'mueblesjs',
      ssl: sslOption,
    });

pool.on('error', (err: Error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);
