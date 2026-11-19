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