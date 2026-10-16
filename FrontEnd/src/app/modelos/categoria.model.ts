export interface Categoria {
	id: number;
	nombre: string;
	descripcion: string;
	imagen: string;
	cantidadProductos: number;
}

export type CategoriaInput = Omit<Categoria, 'id'>;
