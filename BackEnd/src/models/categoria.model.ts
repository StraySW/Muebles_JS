import { pool } from '../config/postgres';

export interface Categoria {
  id: number;
  nombre: string;
  slug_url?: string;
  descripcion: string;
  imagen?: string;
  cantidadProductos?: number;
}

export type CategoriaInput = Omit<Categoria, 'id'>;

export class CategoriaModel {
  static async obtenerTodas(): Promise<Categoria[]> {
    const res = await pool.query(`
      SELECT 
        c.id_categoria AS id,
        c.nombre_categoria AS nombre,
        c.slug_url,
        c.descripcion,
        COUNT(p.id_producto)::int AS "cantidadProductos"
      FROM Categorias c
      LEFT JOIN Productos p ON c.id_categoria = p.id_categoria AND p.es_activo = TRUE
      WHERE c.es_activo = TRUE
      GROUP BY c.id_categoria
      ORDER BY c.id_categoria ASC;
    `);
    return res.rows;
  }

  static async obtenerPorId(id: number): Promise<Categoria | null> {
    const res = await pool.query(
      `
      SELECT 
        id_categoria AS id,
        nombre_categoria AS nombre,
        slug_url,
        descripcion
      FROM Categorias
      WHERE id_categoria = $1 AND es_activo = TRUE;
      `,
      [id]
    );
    return res.rows[0] || null;
  }

  static async crear(categoria: CategoriaInput): Promise<Categoria> {
    const slug = categoria.slug_url || categoria.nombre.toLowerCase().replace(/\s+/g, '-');
    const res = await pool.query(
      `
      INSERT INTO Categorias (nombre_categoria, slug_url, descripcion)
      VALUES ($1, $2, $3)
      RETURNING id_categoria AS id, nombre_categoria AS nombre, slug_url, descripcion;
      `,
      [categoria.nombre, slug, categoria.descripcion]
    );
    return res.rows[0];
  }

  static async actualizar(id: number, categoria: Partial<CategoriaInput>): Promise<Categoria | null> {
    const res = await pool.query(
      `
      UPDATE Categorias
      SET 
        nombre_categoria = COALESCE($2, nombre_categoria),
        descripcion = COALESCE($3, descripcion)
      WHERE id_categoria = $1
      RETURNING id_categoria AS id, nombre_categoria AS nombre, slug_url, descripcion;
      `,
      [id, categoria.nombre, categoria.descripcion]
    );
    return res.rows[0] || null;
  }

  static async eliminar(id: number): Promise<boolean> {
    const res = await pool.query(`DELETE FROM Categorias WHERE id_categoria = $1;`, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
