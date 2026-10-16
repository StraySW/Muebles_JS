import { categoriasDB, obtenerSiguienteIdCategoria } from '../config/database';

export interface Categoria {
	id: number;
	nombre: string;
	descripcion: string;
	imagen: string;
	cantidadProductos: number;
}

export type CategoriaInput = Omit<Categoria, 'id'>;

export class CategoriaModel {
	static async obtenerTodas(): Promise<Categoria[]> {
		return categoriasDB;
	}

	static async obtenerPorId(id: number): Promise<Categoria | null> {
		return categoriasDB.find((cat) => cat.id === id) ?? null;
	}

	static async crear(categoria: CategoriaInput): Promise<Categoria> {
		const nuevaCategoria: Categoria = {
			...categoria,
			id: obtenerSiguienteIdCategoria(),
		};

		categoriasDB.push(nuevaCategoria);
		return nuevaCategoria;
	}

	static async actualizar(
		id: number,
		categoria: CategoriaInput,
	): Promise<Categoria | null> {
		const categoriaActual = categoriasDB.find((item) => item.id === id);

		if (!categoriaActual) {
			return null;
		}

		Object.assign(categoriaActual, categoria);
		return categoriaActual;
	}

	static async eliminar(id: number): Promise<boolean> {
		const index = categoriasDB.findIndex((cat) => cat.id === id);

		if (index === -1) {
			return false;
		}

		categoriasDB.splice(index, 1);
		return true;
	}
}
