export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  edad?: number;
  sexo?: string;
  email: string;
  fecha_creacion?: Date | string;
}

export type ClienteInput = Omit<Cliente, 'id'>;