import type { Request, Response, NextFunction } from 'express';
import { pool } from '../config/postgres';

export const loginUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Correo y contraseña requeridos' });
      return;
    }

    // Validación segura utilizando la extensión pgcrypto de PostgreSQL
    const resultado = await pool.query(
      `
      SELECT 
        u.id_usuario AS id,
        u.cc,
        u.email,
        r.nombre_role AS rol,
        COALESCE(c.nombres, split_part(u.email, '@', 1)) AS nombre,
        COALESCE(c.apellidos, '') AS apellido,
        c.telefono,
        c.direccion
      FROM Usuarios u
      JOIN Roles r ON u.id_role = r.id_role
      LEFT JOIN Clientes c ON u.id_usuario = c.id_usuario
      WHERE LOWER(u.email) = LOWER($1) 
        AND u.password_hash = crypt($2, u.password_hash)
        AND u.es_activo = TRUE;
      `,
      [email, password]
    );

    if (resultado.rowCount === 0) {
      res.status(401).json({ message: 'Credenciales inválidas o usuario inactivo' });
      return;
    }

    const usuario = resultado.rows[0];

    // Actualizar último login
    await pool.query(
      `UPDATE Usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id_usuario = $1;`,
      [usuario.id]
    );

    res.status(200).json({
      mensaje: 'Autenticación exitosa',
      usuario: {
        id: usuario.id,
        cc: usuario.cc,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
      },
    });
  } catch (error) {
    next(error);
  }
};

