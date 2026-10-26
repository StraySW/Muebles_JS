import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const config = {
  host: process.env['DB_HOST'] || 'localhost',
  port: Number(process.env['DB_PORT'] || 5432),
  user: process.env['DB_USER'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'postgres',
};

const targetDatabase = process.env['DB_NAME'] || 'mueblesjs';

async function inicializarBaseDeDatos() {
  console.log(`🔌 Conectando a PostgreSQL en ${config.host}:${config.port} como ${config.user}...`);
  
  // 1. Conexión inicial al cluster de postgres
  const adminClient = new Client({
    ...config,
    database: 'postgres',
  });

  try {
    await adminClient.connect();
    console.log('✅ Conexión administrativa establecida.');

    // Verificar si existe la base de datos
    const res = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [targetDatabase]
    );

    if (res.rowCount === 0) {
      console.log(`🔨 Creando base de datos "${targetDatabase}"...`);
      await adminClient.query(`CREATE DATABASE "${targetDatabase}";`);
      console.log(`✅ Base de datos "${targetDatabase}" creada exitosamente.`);
    } else {
      console.log(`ℹ️ La base de datos "${targetDatabase}" ya existe.`);
    }
  } catch (error) {
    console.error('❌ Error al verificar/crear la base de datos:', error);
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  // 2. Conexión a la base de datos destino para ejecutar el esquema init.sql
  const dbClient = new Client({
    ...config,
    database: targetDatabase,
  });

  try {
    await dbClient.connect();
    console.log(`🔌 Conectado a "${targetDatabase}". Ejecutando init.sql...`);

    const sqlPath = path.resolve(__dirname, '../../database/init.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`No se encontró el archivo SQL en: ${sqlPath}`);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    await dbClient.query(sqlContent);
    console.log('🚀 Esquema relacional, tablas, extensiones, roles e índices creados con éxito!');

    // Cargar datos iniciales indispensables (departamentos y ciudades de Colombia)
    await dbClient.query(`
      INSERT INTO Departamentos (id_departamento, nombre_departamento) VALUES 
      ('11', 'Bogotá D.C.'),
      ('05', 'Antioquia'),
      ('76', 'Valle del Cauca'),
      ('08', 'Atlántico')
      ON CONFLICT (id_departamento) DO NOTHING;

      INSERT INTO Ciudades (id_ciudad, id_departamento, nombre_ciudad) VALUES 
      ('11001', '11', 'Bogotá'),
      ('05001', '05', 'Medellín'),
      ('76001', '76', 'Cali'),
      ('08001', '08', 'Barranquilla')
      ON CONFLICT (id_ciudad) DO NOTHING;

      INSERT INTO Categorias (nombre_categoria, slug_url, descripcion) VALUES
      ('Salas', 'salas', 'Sofás, sillones reclinables y mesas de centro para tu sala.'),
      ('Comedores', 'comedores', 'Mesas elegantes de roble y sillas tapizadas.'),
      ('Dormitorios', 'dormitorios', 'Camas, mesas de noche y armarios funcionales.'),
      ('Oficina y Estudio', 'oficina-y-estudio', 'Escritorios ergonómicos y libreros.')
      ON CONFLICT (slug_url) DO NOTHING;
    `);

    console.log('🌱 Datos semilla cargados (Departamentos, Ciudades, Categorías iniciales).');
  } catch (error) {
    console.error('❌ Error al ejecutar el script de inicialización:', error);
    process.exit(1);
  } finally {
    await dbClient.end();
  }
}

inicializarBaseDeDatos();
