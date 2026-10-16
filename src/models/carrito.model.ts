import { carritoDB, obtenerSiguienteIdCarrito } from '../config/database';

export interface ItemCarrito {
	productoId: number;
	nombre: string;
	precio: number;
	cantidad: number;
	total: number;
	imagen: string;
}

export interface Carrito {
	id: number;
	clienteId: number;
	clienteNombre: string;
	items: ItemCarrito[];
	total: number;
	totalItems: number;
}

export type CarritoInput = Omit<Carrito, 'id'>;

export class CarritoModel {
	static async obtenerTodos(): Promise<Carrito[]> {
		return carritoDB;
	}

	static async obtenerPorId(id: number): Promise<Carrito | null> {
		return carritoDB.find((carrito) => carrito.id === id) ?? null;
	}

	static async obtenerPorClienteId(clienteId: number): Promise<Carrito | null> {
		return (
			carritoDB.find((carrito) => carrito.clienteId === clienteId) ?? null
		);
	}

	static async crear(carrito: CarritoInput): Promise<Carrito> {
		const nuevoCarrito: Carrito = {
			...carrito,
			id: obtenerSiguienteIdCarrito(),
		};

		carritoDB.push(nuevoCarrito);
		return nuevoCarrito;
	}

	static async actualizar(
		id: number,
		carrito: CarritoInput,
	): Promise<Carrito | null> {
		const carritoActual = carritoDB.find((item) => item.id === id);

		if (!carritoActual) {
			return null;
		}

		Object.assign(carritoActual, carrito);
		return carritoActual;
	}

	static async eliminar(id: number): Promise<boolean> {
		const index = carritoDB.findIndex((carrito) => carrito.id === id);

		if (index === -1) {
			return false;
		}

		carritoDB.splice(index, 1);
		return true;
	}
}
