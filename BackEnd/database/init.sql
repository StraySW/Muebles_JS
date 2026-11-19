-- =====================================================================
-- PROYECTO: BASES DE DATOS MASIVAS - EMPRESA MUEBLES JS
-- SCRIPT: init.sql
-- MOTOR: PostgreSQL 15+ / 16 / 18
-- DESCRIPCIÓN: Esquema con IDs UUID, CC para Clientes y Admins/Usuarios
-- =====================================================================

-- Extensión pgcrypto para hash seguro de contraseñas (bcrypt) y UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Eliminar tablas si existen en orden inverso de dependencias
DROP TABLE IF EXISTS logs_auditoria CASCADE;
DROP TABLE IF EXISTS sesiones_usuario CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS detalle_orden CASCADE;
DROP TABLE IF EXISTS ordenes CASCADE;
DROP TABLE IF EXISTS inventario_sede CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS sedes CASCADE;
DROP TABLE IF EXISTS ciudades CASCADE;
DROP TABLE IF EXISTS departamentos CASCADE;

-- ---------------------------------------------------------------------
-- 1. TABLA: Departamentos (División Político-Administrativa DANE)
-- ---------------------------------------------------------------------
CREATE TABLE Departamentos (
    id_departamento VARCHAR(5) PRIMARY KEY,
    nombre_departamento VARCHAR(100) NOT NULL
);

-- ---------------------------------------------------------------------
-- 2. TABLA: Ciudades (Municipios / Ciudades de cobertura)
-- ---------------------------------------------------------------------
CREATE TABLE Ciudades (
    id_ciudad VARCHAR(10) PRIMARY KEY,
    id_departamento VARCHAR(5) NOT NULL,
    nombre_ciudad VARCHAR(100) NOT NULL,
    CONSTRAINT fk_ciudades_departamento FOREIGN KEY (id_departamento) 
        REFERENCES Departamentos(id_departamento) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_ciudades_depto ON Ciudades(id_departamento);

-- ---------------------------------------------------------------------
-- 3. TABLA: Sedes (Sucursales físicas y centros de distribución)
-- ---------------------------------------------------------------------
CREATE TABLE Sedes (
    id_sede SERIAL PRIMARY KEY,
    nombre_sede VARCHAR(120) NOT NULL,
    id_ciudad VARCHAR(10) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(30),
    es_bodega_central BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_sedes_ciudad FOREIGN KEY (id_ciudad) 
        REFERENCES Ciudades(id_ciudad) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_sedes_ciudad ON Sedes(id_ciudad);

-- ---------------------------------------------------------------------
-- 4. TABLA: Roles (RBAC - Control de Acceso Basado en Roles para la Web)
-- ---------------------------------------------------------------------
CREATE TABLE Roles (
    id_role SERIAL PRIMARY KEY,
    nombre_role VARCHAR(50) NOT NULL UNIQUE, -- 'ADMIN', 'VENDEDOR', 'CLIENTE', 'BODEGUERO'
    descripcion VARCHAR(255)
);

-- Inserción de roles iniciales
INSERT INTO Roles (nombre_role, descripcion) VALUES 
('ADMIN', 'Administrador con acceso integral al dashboard y gestión de inventario'),
('CLIENTE', 'Usuario comprador de la plataforma web'),
('VENDEDOR', 'Personal de ventas y atención en sedes físicas'),
('BODEGUERO', 'Encargado de despacho y actualización de inventario físico');

-- ---------------------------------------------------------------------
-- 5. TABLA: Usuarios (Autenticación web, login, CC y UUID)
-- ---------------------------------------------------------------------
CREATE TABLE Usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cc VARCHAR(10) NOT NULL UNIQUE, -- Cédula de ciudadanía para Administradores / Usuarios del sistema
    id_role INT NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    es_activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_role FOREIGN KEY (id_role) 
        REFERENCES Roles(id_role) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_usuarios_email ON Usuarios(email);
CREATE INDEX idx_usuarios_role ON Usuarios(id_role);
CREATE INDEX idx_usuarios_cc ON Usuarios(cc);

-- Usuario administrador por defecto (password: Admin123*, cc: 1000000001)
INSERT INTO Usuarios (id_usuario, cc, id_role, email, password_hash)
VALUES (gen_random_uuid(), '1000000001', 1, 'admin@mueblesjs.com', crypt('Admin123*', gen_salt('bf', 10)));

-- ---------------------------------------------------------------------
-- 6. TABLA: Sesiones_Usuario (Gestión de tokens web / JWT y persistencia)
-- ---------------------------------------------------------------------
CREATE TABLE Sesiones_Usuario (
    id_sesion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    token_sesion VARCHAR(500) NOT NULL UNIQUE,
    ip_origen VARCHAR(45),
    user_agent TEXT,
    fecha_expiracion TIMESTAMP WITH TIME ZONE NOT NULL,
    es_valida BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_sesion_usuario FOREIGN KEY (id_usuario) 
        REFERENCES Usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_sesiones_usuario ON Sesiones_Usuario(id_usuario);
CREATE INDEX idx_sesiones_token ON Sesiones_Usuario(token_sesion);

-- ---------------------------------------------------------------------
-- 7. TABLA: Clientes (Datos del comprador asociados al perfil web con UUID y CC)
-- ---------------------------------------------------------------------
CREATE TABLE Clientes (
    id_cliente UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cc VARCHAR(20) NOT NULL UNIQUE, -- Cédula de ciudadanía del cliente
    id_usuario UUID UNIQUE, -- Vinculación 1 a 1 opcional con la cuenta web
    nombres VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150),
    telefono VARCHAR(30),
    id_ciudad VARCHAR(10) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) 
        REFERENCES Usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_cliente_ciudad FOREIGN KEY (id_ciudad) 
        REFERENCES Ciudades(id_ciudad) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_clientes_cc ON Clientes(cc);
CREATE INDEX idx_clientes_ciudad ON Clientes(id_ciudad);
CREATE INDEX idx_clientes_usuario ON Clientes(id_usuario);

-- ---------------------------------------------------------------------
-- 8. TABLA: Categorias (Taxonomía de catálogo de muebles)
-- ---------------------------------------------------------------------
CREATE TABLE Categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    slug_url VARCHAR(120) NOT NULL UNIQUE, -- Optimización para SEO web
    descripcion TEXT,
    es_activo BOOLEAN DEFAULT TRUE
);

-- ---------------------------------------------------------------------
-- 9. TABLA: Productos (Catálogo maestro de muebles)
-- ---------------------------------------------------------------------
CREATE TABLE Productos (
    id_producto VARCHAR(30) PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre_producto VARCHAR(180) NOT NULL,
    slug_url VARCHAR(200) NOT NULL UNIQUE,
    material VARCHAR(100),
    color VARCHAR(50),
    dimensiones VARCHAR(80),
    precio_base NUMERIC(14,2) NOT NULL CHECK (precio_base >= 0),
    costo_fabricacion NUMERIC(14,2) CHECK (costo_fabricacion >= 0),
    imagen_principal_url VARCHAR(500),
    es_destacado_web BOOLEAN DEFAULT FALSE,
    es_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) 
        REFERENCES Categorias(id_categoria) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_productos_categoria ON Productos(id_categoria);
CREATE INDEX idx_productos_precio ON Productos(precio_base);
CREATE INDEX idx_productos_destacado ON Productos(es_destacado_web) WHERE es_destacado_web = TRUE;

-- ---------------------------------------------------------------------
-- 10. TABLA: Inventario_Sede (Existencias físicas por sucursal)
-- ---------------------------------------------------------------------
CREATE TABLE Inventario_Sede (
    id_inventario BIGSERIAL PRIMARY KEY,
    id_sede INT NOT NULL,
    id_producto VARCHAR(30) NOT NULL,
    stock_disponible INT NOT NULL DEFAULT 0 CHECK (stock_disponible >= 0),
    stock_minimo_alerta INT DEFAULT 5,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_sede FOREIGN KEY (id_sede) 
        REFERENCES Sedes(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_inv_producto FOREIGN KEY (id_producto) 
        REFERENCES Productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_sede_producto UNIQUE (id_sede, id_producto)
);

CREATE INDEX idx_inv_producto ON Inventario_Sede(id_producto);
CREATE INDEX idx_inv_sede ON Inventario_Sede(id_sede);

-- ---------------------------------------------------------------------
-- 11. TABLA: Ordenes (Cabecera transaccional de compras)
-- ---------------------------------------------------------------------
CREATE TABLE Ordenes (
    id_orden VARCHAR(35) PRIMARY KEY,
    id_cliente UUID NOT NULL,
    id_sede_despacho INT,
    fecha_orden TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente', 
    subtotal NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    impuestos NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (impuestos >= 0),
    costo_envio NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (costo_envio >= 0),
    total NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
    CONSTRAINT fk_orden_cliente FOREIGN KEY (id_cliente) 
        REFERENCES Clientes(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_orden_sede FOREIGN KEY (id_sede_despacho) 
        REFERENCES Sedes(id_sede) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_orden_estado CHECK (estado IN ('Pendiente', 'Pagada', 'En Preparación', 'Despachada', 'Entregada', 'Cancelada'))
);

CREATE INDEX idx_ordenes_cliente ON Ordenes(id_cliente);
CREATE INDEX idx_ordenes_fecha ON Ordenes(fecha_orden);
CREATE INDEX idx_ordenes_estado ON Ordenes(estado);

-- ---------------------------------------------------------------------
-- 12. TABLA: Detalle_Orden (Items comprados con congelamiento de precio histórico)
-- ---------------------------------------------------------------------
CREATE TABLE Detalle_Orden (
    id_orden VARCHAR(35) NOT NULL,
    id_producto VARCHAR(30) NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(14,2) NOT NULL CHECK (precio_unitario >= 0),
    descuento_aplicado NUMERIC(14,2) DEFAULT 0.00 CHECK (descuento_aplicado >= 0),
    PRIMARY KEY (id_orden, id_producto),
    CONSTRAINT fk_det_orden FOREIGN KEY (id_orden) 
        REFERENCES Ordenes(id_orden) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_det_producto FOREIGN KEY (id_producto) 
        REFERENCES Productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_detalle_producto ON Detalle_Orden(id_producto);

-- ---------------------------------------------------------------------
-- 13. TABLA: Pagos (Pasarela de pagos en línea web)
-- ---------------------------------------------------------------------
CREATE TABLE Pagos (
    id_pago BIGSERIAL PRIMARY KEY,
    id_orden VARCHAR(35) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    referencia_transaccion VARCHAR(100) UNIQUE,
    monto NUMERIC(14,2) NOT NULL CHECK (monto > 0),
    estado_pago VARCHAR(30) NOT NULL DEFAULT 'Aprobado',
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pago_orden FOREIGN KEY (id_orden) 
        REFERENCES Ordenes(id_orden) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_estado_pago CHECK (estado_pago IN ('Pendiente', 'Aprobado', 'Rechazado', 'Reembolsado'))
);

CREATE INDEX idx_pagos_orden ON Pagos(id_orden);

-- ---------------------------------------------------------------------
-- 14. TABLA: Logs_Auditoria (Trazabilidad y seguridad para el Administrador)
-- ---------------------------------------------------------------------
CREATE TABLE Logs_Auditoria (
    id_log BIGSERIAL PRIMARY KEY,
    id_usuario UUID,
    accion VARCHAR(60) NOT NULL,
    tabla_afectada VARCHAR(60) NOT NULL,
    registro_id VARCHAR(100),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    fecha_evento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) 
        REFERENCES Usuarios(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_logs_usuario ON Logs_Auditoria(id_usuario);
CREATE INDEX idx_logs_fecha ON Logs_Auditoria(fecha_evento);
