import { pool } from '../config/postgres';

export interface Cliente {
  id?: string;
  cc: string;
  nombre: string;
  apellido: string;
  edad?: number;
  sexo?: string;
  email?: string;
  telefono?: string;
  id_ciudad?: string;
  direccion?: string;
  id_usuario?: string;
  fecha_creacion?: Date | string;
}

export class ClienteModel {
  static async obtenerTodos(): Promise<Cliente[]> {
    const res = await pool.query(`
      SELECT 
        c.id_cliente AS id,
        c.cc,
        c.nombres AS nombre,
        c.apellidos AS apellido,
        c.telefono,
        c.direccion,
        c.id_ciudad,
        c.id_usuario,
        u.email,
        c.fecha_registro AS fecha_creacion
      FROM Clientes c
      LEFT JOIN Usuarios u ON c.id_usuario = u.id_usuario
      ORDER BY c.fecha_registro DESC;
    `);
    return res.rows;
  }

  static async obtenerPorId(id: string): Promise<Cliente | null> {
    const res = await pool.query(
      `
      SELECT 
        c.id_cliente AS id,
        c.cc,
        c.nombres AS nombre,
        c.apellidos AS apellido,
        c.telefono,
        c.direccion,
        c.id_ciudad,
        c.id_usuario,
        u.email,
        c.fecha_registro AS fecha_creacion
      FROM Clientes c
      LEFT JOIN Usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_cliente = $1 OR c.cc = $1;
      `,
      [id]
    );
    return res.rows[0] || null;
  }

  static async crear(cliente: Cliente): Promise<Cliente> {
    const res = await pool.query(
      `
      INSERT INTO Clientes (cc, nombres, apellidos, telefono, id_ciudad, direccion, id_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id_cliente AS id,
        cc,
        nombres AS nombre,
        apellidos AS apellido,
        telefono,
        id_ciudad,
        direccion,
        id_usuario,
        fecha_registro AS fecha_creacion;
      `,
      [
        cliente.cc,
        cliente.nombre,
        cliente.apellido,
        cliente.telefono || null,
        cliente.id_ciudad || '11001',
        cliente.direccion || 'No especificada',
        cliente.id_usuario || null,
      ]
    );
    return res.rows[0];
  }

  static async actualizar(id: string, cliente: Partial<Cliente>): Promise<Cliente | null> {
    const res = await pool.query(
      `
      UPDATE Clientes
      SET 
        nombres = COALESCE($2, nombres),
        apellidos = COALESCE($3, apellidos),
        telefono = COALESCE($4, telefono),
        direccion = COALESCE($5, direccion)
      WHERE id_cliente = $1 OR cc = $1
      RETURNING 
        id_cliente AS id,
        cc,
        nombres AS nombre,
        apellidos AS apellido,
        telefono,
        id_ciudad,
        direccion,
        id_usuario,
        fecha_registro AS fecha_creacion;
      `,
      [id, cliente.nombre, cliente.apellido, cliente.telefono, cliente.direccion]
    );
    return res.rows[0] || null;
  }

  static async eliminar(id: string): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM Clientes WHERE id_cliente = $1 OR cc = $1;`,
      [id]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
