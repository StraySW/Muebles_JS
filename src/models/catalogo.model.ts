import { pool } from '../config/postgres';

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  id_categoria?: number;
  precio: number;
  material?: string;
  color?: string;
  dimensiones?: string;
  stock?: number;
  imagen?: string;
}

export type ProductoInput = Omit<Producto, 'id'>;

export class CatalogoModel {
  static async obtenerTodos(): Promise<Producto[]> {
    const res = await pool.query(`
      SELECT 
        p.id_producto AS id,
        p.nombre_producto AS nombre,
        c.nombre_categoria AS categoria,
        p.id_categoria,
        p.precio_base::numeric AS precio,
        p.material,
        p.color,
        p.dimensiones,
        p.imagen_principal_url AS imagen,
        COALESCE(SUM(i.stock_disponible), 0)::int AS stock
      FROM Productos p
      LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN Inventario_Sede i ON p.id_producto = i.id_producto
      WHERE p.es_activo = TRUE
      GROUP BY p.id_producto, c.nombre_categoria
      ORDER BY p.fecha_creacion DESC;
    `);
    return res.rows;
  }

  static async obtenerPorId(id: string): Promise<Producto | null> {
    const res = await pool.query(
      `
      SELECT 
        p.id_producto AS id,
        p.nombre_producto AS nombre,
        c.nombre_categoria AS categoria,
        p.id_categoria,
        p.precio_base::numeric AS precio,
        p.material,
        p.color,
        p.dimensiones,
        p.imagen_principal_url AS imagen,
        COALESCE(SUM(i.stock_disponible), 0)::int AS stock
      FROM Productos p
      LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN Inventario_Sede i ON p.id_producto = i.id_producto
      WHERE p.id_producto = $1 AND p.es_activo = TRUE
      GROUP BY p.id_producto, c.nombre_categoria;
      `,
      [id]
    );
    return res.rows[0] || null;
  }

  static async obtenerPorCategoria(categoria: string): Promise<Producto[]> {
    const res = await pool.query(
      `
      SELECT 
        p.id_producto AS id,
        p.nombre_producto AS nombre,
        c.nombre_categoria AS categoria,
        p.id_categoria,
        p.precio_base::numeric AS precio,
        p.material,
        p.color,
        p.dimensiones,
        p.imagen_principal_url AS imagen,
        COALESCE(SUM(i.stock_disponible), 0)::int AS stock
      FROM Productos p
      LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN Inventario_Sede i ON p.id_producto = i.id_producto
      WHERE (LOWER(c.nombre_categoria) = LOWER($1) OR c.slug_url = LOWER($1)) AND p.es_activo = TRUE
      GROUP BY p.id_producto, c.nombre_categoria;
      `,
      [categoria]
    );
    return res.rows;
  }

  static async crear(producto: ProductoInput): Promise<Producto> {
    const idProducto = 'PROD-' + Date.now();
    const slug = producto.nombre.toLowerCase().replace(/\s+/g, '-');
    const res = await pool.query(
      `
      INSERT INTO Productos (
        id_producto, id_categoria, nombre_producto, slug_url, material, color, dimensiones, precio_base, imagen_principal_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING 
        id_producto AS id,
        nombre_producto AS nombre,
        precio_base::numeric AS precio,
        material,
        color,
        dimensiones,
        imagen_principal_url AS imagen;
      `,
      [
        idProducto,
        producto.id_categoria || 1,
        producto.nombre,
        slug,
        producto.material || null,
        producto.color || null,
        producto.dimensiones || null,
        producto.precio,
        producto.imagen || null,
      ]
    );
    return res.rows[0];
  }

  static async actualizar(id: string, producto: Partial<ProductoInput>): Promise<Producto | null> {
    const res = await pool.query(
      `
      UPDATE Productos
      SET 
        nombre_producto = COALESCE($2, nombre_producto),
        precio_base = COALESCE($3, precio_base),
        material = COALESCE($4, material),
        color = COALESCE($5, color),
        dimensiones = COALESCE($6, dimensiones)
      WHERE id_producto = $1
      RETURNING id_producto AS id, nombre_producto AS nombre, precio_base::numeric AS precio;
      `,
      [id, producto.nombre, producto.precio, producto.material, producto.color, producto.dimensiones]
    );
    return res.rows[0] || null;
  }

  static async eliminar(id: string): Promise<boolean> {
    const res = await pool.query(`UPDATE Productos SET es_activo = FALSE WHERE id_producto = $1;`, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
