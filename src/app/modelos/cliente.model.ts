export interface Cliente {
	id: number;
	nombre: string;
	cedula: string;
	direccion: string;
	telefono: string;
}

export type ClienteInput = Omit<Cliente, 'id'>;