import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import { bootstrapDatabase } from './config/db-bootstrap';

const PORT = process.env['PORT'] || 3000;

async function startServer() {
  try {
    await bootstrapDatabase();
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  }

  app.listen(PORT, () => {
    console.log(`API ejecutandose en ${PORT}`);
  });
}

startServer();
