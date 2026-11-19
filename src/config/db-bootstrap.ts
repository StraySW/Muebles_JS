import { pool } from './postgres';

export async function bootstrapDatabase(): Promise<void> {
  try {
    console.log('🔄 Verificando tablas en PostgreSQL...');
    
    // 1. Habilitar extensión pgcrypto
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    // 2. Verificar si existe la tabla Categorias
    const tableCheck = await pool.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'categorias';
    `);

    if (tableCheck.rowCount === 0) {
      console.log('📦 Tabla Categorias no existe. Creando esquema relacional completo...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS Departamentos (
            id_departamento VARCHAR(5) PRIMARY KEY,
            nombre_departamento VARCHAR(100) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Ciudades (
            id_ciudad VARCHAR(10) PRIMARY KEY,
            id_departamento VARCHAR(5) NOT NULL,
            nombre_ciudad VARCHAR(100) NOT NULL,
            CONSTRAINT fk_ciudades_depto FOREIGN KEY (id_departamento) 
                REFERENCES Departamentos(id_departamento) ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS Sedes (
            id_sede SERIAL PRIMARY KEY,
            nombre_sede VARCHAR(120) NOT NULL,
            id_ciudad VARCHAR(10) NOT NULL,
            direccion VARCHAR(255) NOT NULL,
            telefono VARCHAR(30),
            es_bodega_central BOOLEAN DEFAULT FALSE,
            CONSTRAINT fk_sedes_ciudad FOREIGN KEY (id_ciudad) 
                REFERENCES Ciudades(id_ciudad) ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS Roles (
            id_role SERIAL PRIMARY KEY,
            nombre_role VARCHAR(50) UNIQUE NOT NULL,
            descripcion VARCHAR(255),
            fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Usuarios (
            id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            cc VARCHAR(20) UNIQUE NOT NULL,
            id_role INT NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            es_activo BOOLEAN DEFAULT TRUE,
            fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_usuarios_role FOREIGN KEY (id_role) 
                REFERENCES Roles(id_role) ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS Clientes (
            id_cliente UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            cc VARCHAR(20) UNIQUE NOT NULL,
            nombres VARCHAR(100) NOT NULL,
            apellidos VARCHAR(100) NOT NULL,
            telefono VARCHAR(30),
            direccion VARCHAR(255),
            id_ciudad VARCHAR(10),
            id_usuario UUID UNIQUE,
            fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_clientes_ciudad FOREIGN KEY (id_ciudad) 
                REFERENCES Ciudades(id_ciudad) ON UPDATE CASCADE ON DELETE SET NULL,
            CONSTRAINT fk_clientes_usuario FOREIGN KEY (id_usuario) 
                REFERENCES Usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS Categorias (
            id_categoria SERIAL PRIMARY KEY,
            nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
            slug_url VARCHAR(120) NOT NULL UNIQUE,
            descripcion TEXT,
            imagen_banner_url VARCHAR(500),
            es_activa BOOLEAN DEFAULT TRUE
        );

        CREATE TABLE IF NOT EXISTS Productos (
            id_producto VARCHAR(30) PRIMARY KEY,
            id_categoria INT NOT NULL,
            nombre_producto VARCHAR(180) NOT NULL,
            slug_url VARCHAR(200) NOT NULL UNIQUE,
            descripcion TEXT,
            precio_base NUMERIC(12,2) NOT NULL CHECK (precio_base >= 0),
            material VARCHAR(100),
            color VARCHAR(50),
            dimensiones VARCHAR(100),
            imagen_principal_url VARCHAR(500),
            es_activo BOOLEAN DEFAULT TRUE,
            fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_productos_categoria FOREIGN KEY (id_categoria) 
                REFERENCES Categorias(id_categoria) ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS Inventario_Sede (
            id_sede INT NOT NULL,
            id_producto VARCHAR(30) NOT NULL,
            stock_disponible INT NOT NULL DEFAULT 0 CHECK (stock_disponible >= 0),
            stock_minimo_alerta INT NOT NULL DEFAULT 5 CHECK (stock_minimo_alerta >= 0),
            PRIMARY KEY (id_sede, id_producto),
            CONSTRAINT fk_inv_sede FOREIGN KEY (id_sede) 
                REFERENCES Sedes(id_sede) ON UPDATE CASCADE ON DELETE CASCADE,
            CONSTRAINT fk_inv_producto FOREIGN KEY (id_producto) 
                REFERENCES Productos(id_producto) ON UPDATE CASCADE ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS Ordenes (
            id_orden VARCHAR(35) PRIMARY KEY,
            id_cliente UUID NOT NULL,
            id_sede_despacho INT,
            fecha_orden TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente', 
            subtotal NUMERIC(14,2) NOT NULL DEFAULT 0.00,
            impuestos NUMERIC(14,2) NOT NULL DEFAULT 0.00,
            costo_envio NUMERIC(14,2) NOT NULL DEFAULT 0.00,
            total NUMERIC(14,2) NOT NULL DEFAULT 0.00,
            CONSTRAINT fk_orden_cliente FOREIGN KEY (id_cliente) 
                REFERENCES Clientes(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS Detalle_Orden (
            id_orden VARCHAR(35) NOT NULL,
            id_producto VARCHAR(30) NOT NULL,
            cantidad INT NOT NULL CHECK (cantidad > 0),
            precio_unitario NUMERIC(14,2) NOT NULL,
            descuento_aplicado NUMERIC(14,2) DEFAULT 0.00,
            PRIMARY KEY (id_orden, id_producto),
            CONSTRAINT fk_det_orden FOREIGN KEY (id_orden) 
                REFERENCES Ordenes(id_orden) ON UPDATE CASCADE ON DELETE CASCADE,
            CONSTRAINT fk_det_producto FOREIGN KEY (id_producto) 
                REFERENCES Productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
        );
      `);

      console.log('✅ Esquema creado con éxito.');
    }

    // 3. Sembrar datos esenciales si faltan
    await pool.query(`
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

      INSERT INTO Sedes (id_sede, nombre_sede, id_ciudad, direccion, telefono, es_bodega_central) VALUES
      (1, 'Sede Principal Bogotá', '11001', 'Calle 100 # 15-20', '6017654321', TRUE)
      ON CONFLICT (id_sede) DO NOTHING;

      INSERT INTO Roles (id_role, nombre_role, descripcion) VALUES
      (1, 'Administrador', 'Control total de la plataforma'),
      (2, 'Cliente', 'Usuario final registrado'),
      (3, 'Vendedor', 'Gestión de cotizaciones')
      ON CONFLICT (id_role) DO NOTHING;

      INSERT INTO Categorias (id_categoria, nombre_categoria, slug_url, descripcion) VALUES
      (1, 'Salas', 'salas', 'Sofás, sillones reclinables y mesas de centro para tu sala.'),
      (2, 'Comedores', 'comedores', 'Mesas elegantes de roble y sillas tapizadas.'),
      (3, 'Dormitorios', 'dormitorios', 'Camas, mesas de noche y armarios funcionales.'),
      (4, 'Oficina y Estudio', 'oficina-y-estudio', 'Escritorios ergonómicos y libreros.')
      ON CONFLICT (id_categoria) DO NOTHING;

      INSERT INTO Productos (id_producto, id_categoria, nombre_producto, slug_url, descripcion, precio_base, material, color, dimensiones, imagen_principal_url, es_activo) VALUES
      ('PROD-001', 1, 'Sofá Chesterfield Cuero Vintage', 'sofa-chesterfield-cuero', 'Sofá clásico de 3 puestos elaborado en cuero legítimo.', 3200000, 'Cuero vacuno y roble', 'Café habano', '220x95x85 cm', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', TRUE),
      ('PROD-002', 2, 'Comedor Nórdico Roble Macizo 6 Puestos', 'comedor-nordico-roble', 'Mesa de comedor rectangular con 6 sillas tapizadas en tela repelente.', 2450000, 'Roble macizo y lino', 'Roble claro / Gris', '180x90x75 cm', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80', TRUE),
      ('PROD-003', 3, 'Cama King Size Tapizada Lino', 'cama-king-size-lino', 'Estructura robusta en cedro con cabecero capitoneado.', 2890000, 'Cedro y lino premium', 'Gris perla', '200x200x120 cm', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', TRUE),
      ('PROD-004', 4, 'Escritorio Ejecutivo Ergocenter', 'escritorio-ejecutivo-ergocenter', 'Escritorio amplio con pasacables y cajonera metálica con cerradura.', 1350000, 'Nogal y acero', 'Nogal oscuro / Negro', '150x70x75 cm', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80', TRUE),
      ('PROD-005', 1, 'Sillón Ocasional Velvet Esmeralda', 'sillon-ocasional-velvet', 'Poltrona individual con patas doradas y espuma de alta densidad.', 890000, 'Terciopelo antifluido', 'Verde esmeralda', '80x75x85 cm', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', TRUE)
      ON CONFLICT (id_producto) DO NOTHING;

      INSERT INTO Inventario_Sede (id_sede, id_producto, stock_disponible, stock_minimo_alerta) VALUES
      (1, 'PROD-001', 12, 3),
      (1, 'PROD-002', 8, 2),
      (1, 'PROD-003', 6, 2),
      (1, 'PROD-004', 15, 4),
      (1, 'PROD-005', 20, 5)
      ON CONFLICT (id_sede, id_producto) DO UPDATE SET stock_disponible = EXCLUDED.stock_disponible;

      INSERT INTO Clientes (id_cliente, cc, nombres, apellidos, telefono, direccion, id_ciudad) VALUES
      ('11111111-1111-1111-1111-111111111111', '1020304050', 'Carlos Alberto', 'Gómez Restrepo', '3001234567', 'Cra 15 # 85-30 Apt 402', '11001'),
      ('22222222-2222-2222-2222-222222222222', '1030405060', 'Mariana Sofía', 'Rodríguez Meza', '3159876543', 'Calle 10 # 42-15 Int 3', '05001'),
      ('33333333-3333-3333-3333-333333333333', '1040506070', 'Andrés Felipe', 'Morales Torres', '3187654321', 'Av. Pasoancho # 56-20', '76001')
      ON CONFLICT (cc) DO NOTHING;

      CREATE TABLE IF NOT EXISTS Ordenes (
          id_orden VARCHAR(35) PRIMARY KEY,
          id_cliente UUID NOT NULL,
          id_sede_despacho INT,
          fecha_orden TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente', 
          subtotal NUMERIC(14,2) NOT NULL DEFAULT 0.00,
          impuestos NUMERIC(14,2) NOT NULL DEFAULT 0.00,
          costo_envio NUMERIC(14,2) NOT NULL DEFAULT 0.00,
          total NUMERIC(14,2) NOT NULL DEFAULT 0.00,
          CONSTRAINT fk_orden_cliente FOREIGN KEY (id_cliente) 
              REFERENCES Clientes(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS Detalle_Orden (
          id_orden VARCHAR(35) NOT NULL,
          id_producto VARCHAR(30) NOT NULL,
          cantidad INT NOT NULL CHECK (cantidad > 0),
          precio_unitario NUMERIC(14,2) NOT NULL,
          descuento_aplicado NUMERIC(14,2) DEFAULT 0.00,
          PRIMARY KEY (id_orden, id_producto),
          CONSTRAINT fk_det_orden FOREIGN KEY (id_orden) 
              REFERENCES Ordenes(id_orden) ON UPDATE CASCADE ON DELETE CASCADE,
          CONSTRAINT fk_det_producto FOREIGN KEY (id_producto) 
              REFERENCES Productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
      );

      INSERT INTO Ordenes (id_orden, id_cliente, estado, total) VALUES
      ('ORD-2026-001', '11111111-1111-1111-1111-111111111111', 'Pendiente', 3200000.00)
      ON CONFLICT (id_orden) DO NOTHING;

      INSERT INTO Detalle_Orden (id_orden, id_producto, cantidad, precio_unitario) VALUES
      ('ORD-2026-001', 'PROD-001', 1, 3200000.00)
      ON CONFLICT (id_orden, id_producto) DO NOTHING;
    `);

    console.log('🌱 Base de datos verificada y semillas sincronizadas exitosamente.');
  } catch (error) {
    console.error('❌ Error en el bootstrap de la base de datos:', error);
  }
}
