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
