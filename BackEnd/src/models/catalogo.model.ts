import { catalogoDB, obtenerSiguienteIdCatalogo } from '../config/database';

export interface Producto {
	id: number;
	nombre: string;
	descripcion: string;
	categoria: string;
	precio: number;
	material: string;
	stock: number;
	imagen: string;
}

export type ProductoInput = Omit<Producto, 'id'>;

export class CatalogoModel {
	static async obtenerTodos(): Promise<Producto[]> {
		return catalogoDB;
	}

	static async obtenerPorId(id: number): Promise<Producto | null> {
		return catalogoDB.find((producto) => producto.id === id) ?? null;
	}

	static async obtenerPorCategoria(categoria: string): Promise<Producto[]> {
		return catalogoDB.filter(
			(producto) =>
				producto.categoria.toLowerCase() === categoria.toLowerCase(),
		);
	}

	static async crear(producto: ProductoInput): Promise<Producto> {
		const nuevoProducto: Producto = {
			...producto,
			id: obtenerSiguienteIdCatalogo(),
		};

		catalogoDB.push(nuevoProducto);
		return nuevoProducto;
	}

	static async actualizar(
		id: number,
		producto: ProductoInput,
	): Promise<Producto | null> {
		const productoActual = catalogoDB.find((item) => item.id === id);

		if (!productoActual) {
			return null;
		}

		Object.assign(productoActual, producto);
		return productoActual;
	}

	static async eliminar(id: number): Promise<boolean> {
		const index = catalogoDB.findIndex((producto) => producto.id === id);

		if (index === -1) {
			return false;
		}

		catalogoDB.splice(index, 1);
		return true;
	}
}
