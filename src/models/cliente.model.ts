import { clientesDB, obtenerSiguienteId } from '../config/database';

export interface Cliente {
	id: number;
	nombre: string;
	cedula: string;
	direccion: string;
	telefono: string;
}

export type ClienteInput = Omit<Cliente, 'id'>;

export class ClienteModel {
	static async obtenerTodos(): Promise<Cliente[]> {
		return clientesDB;
	}

	static async obtenerPorId(id: number): Promise<Cliente | null> {
		return clientesDB.find((cliente) => cliente.id === id) ?? null;
	}

	static async crear(cliente: ClienteInput): Promise<Cliente> {
		const nuevoCliente: Cliente = {
			...cliente,
			id: obtenerSiguienteId(),
		};

		clientesDB.push(nuevoCliente);
		return nuevoCliente;
	}

	static async actualizar(
		id: number,
		cliente: ClienteInput,
	): Promise<Cliente | null> {
		const clienteActual = clientesDB.find((item) => item.id === id);

		if (!clienteActual) {
			return null;
		}

		Object.assign(clienteActual, cliente);
		return clienteActual;
	}

	static async eliminar(id: number): Promise<boolean> {
		const index = clientesDB.findIndex((cliente) => cliente.id === id);

		if (index === -1) {
			return false;
		}

		clientesDB.splice(index, 1);
		return true;
	}
}
