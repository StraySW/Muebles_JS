import { pool } from '../config/postgres';

export interface ItemCarrito {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  total: number;
  imagen?: string;
}

export interface Carrito {
  id: string;
  clienteId: string;
  clienteNombre: string;
  items: ItemCarrito[];
  total: number;
  totalItems: number;
}

export type CarritoInput = Omit<Carrito, 'id'>;

export class CarritoModel {
  static async obtenerTodos(): Promise<Carrito[]> {
    const res = await pool.query(`
      SELECT 
        o.id_orden AS id,
        o.id_cliente AS "clienteId",
        CONCAT(c.nombres, ' ', COALESCE(c.apellidos, '')) AS "clienteNombre",
        o.total::numeric AS total,
        COALESCE(SUM(d.cantidad), 0)::int AS "totalItems"
      FROM Ordenes o
      JOIN Clientes c ON o.id_cliente = c.id_cliente
      LEFT JOIN Detalle_Orden d ON o.id_orden = d.id_orden
      WHERE o.estado = 'Pendiente'
      GROUP BY o.id_orden, o.id_cliente, c.nombres, c.apellidos
      ORDER BY o.fecha_orden DESC;
    `);

    return res.rows.map((row) => ({
      ...row,
      items: [],
    }));
  }

  static async obtenerPorId(id: string): Promise<Carrito | null> {
    const res = await pool.query(
      `
      SELECT 
        o.id_orden AS id,
        o.id_cliente AS "clienteId",
        CONCAT(c.nombres, ' ', COALESCE(c.apellidos, '')) AS "clienteNombre",
        o.total::numeric AS total
      FROM Ordenes o
      JOIN Clientes c ON o.id_cliente = c.id_cliente
      WHERE o.id_orden = $1;
      `,
      [id]
    );

    if (res.rowCount === 0) return null;

    const itemsRes = await pool.query(
      `
      SELECT 
        d.id_producto AS "productoId",
        p.nombre_producto AS nombre,
        d.precio_unitario::numeric AS precio,
        d.cantidad,
        (d.precio_unitario * d.cantidad)::numeric AS total,
        p.imagen_principal_url AS imagen
      FROM Detalle_Orden d
      JOIN Productos p ON d.id_producto = p.id_producto
      WHERE d.id_orden = $1;
      `,
      [id]
    );

    const row = res.rows[0];
    return {
      id: row.id,
      clienteId: row.clienteId,
      clienteNombre: row.clienteNombre,
      items: itemsRes.rows,
      total: Number(row.total),
      totalItems: itemsRes.rows.reduce((acc, item) => acc + item.cantidad, 0),
    };
  }

  static async obtenerPorClienteId(clienteId: string): Promise<Carrito | null> {
    const res = await pool.query(
      `
      SELECT id_orden FROM Ordenes
      WHERE id_cliente = $1 AND estado = 'Pendiente'
      ORDER BY fecha_orden DESC LIMIT 1;
      `,
      [clienteId]
    );
    if (res.rowCount === 0) return null;
    return this.obtenerPorId(res.rows[0].id_orden);
  }

  static async crear(carrito: CarritoInput): Promise<Carrito> {
    const idOrden = 'ORD-' + Date.now();
    await pool.query(
      `
      INSERT INTO Ordenes (id_orden, id_cliente, total, estado)
      VALUES ($1, $2, $3, 'Pendiente');
      `,
      [idOrden, carrito.clienteId, carrito.total]
    );

    return {
      id: idOrden,
      ...carrito,
    };
  }

  static async actualizar(id: string, carrito: Partial<CarritoInput>): Promise<Carrito | null> {
    if (carrito.total !== undefined) {
      await pool.query(
        `UPDATE Ordenes SET total = $2 WHERE id_orden = $1;`,
        [id, carrito.total]
      );
    }
    return this.obtenerPorId(id);
  }

  static async eliminar(id: string): Promise<boolean> {
    const res = await pool.query(`DELETE FROM Ordenes WHERE id_orden = $1;`, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
