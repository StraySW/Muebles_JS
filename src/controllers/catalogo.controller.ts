import type { NextFunction, Request, Response } from 'express';
import { CatalogoModel, type ProductoInput } from '../models/catalogo.model';

export const obtenerCatalogo = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const categoria = req.query['categoria'] as string | undefined;
		const productos = categoria
			? await CatalogoModel.obtenerPorCategoria(categoria)
			: await CatalogoModel.obtenerTodos();

		console.log(`Catálogo obtenido (${productos.length} productos):`, productos);
		res.status(200).json(productos);
	} catch (error) {
		next(error);
	}
};

export const obtenerProductoPorId = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = Number(req.params['id']);
		const producto = await CatalogoModel.obtenerPorId(id);
		console.log('Producto solicitado:', producto);

		if (!producto) {
			res.status(404).json({ message: 'Producto no encontrado' });
			return;
		}

		res.status(200).json(producto);
	} catch (error) {
		next(error);
	}
};

export const crearProducto = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const nuevoProducto = await CatalogoModel.crear(req.body as ProductoInput);
		console.log('Producto creado:', nuevoProducto);
		res.status(201).json(nuevoProducto);
	} catch (error) {
		next(error);
	}
};

export const actualizarProducto = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = Number(req.params['id']);
		const producto = await CatalogoModel.actualizar(
			id,
			req.body as ProductoInput,
		);
		console.log('Producto actualizado:', producto);

		if (!producto) {
			res.status(404).json({ message: 'Producto no encontrado' });
			return;
		}

		res.status(200).json(producto);
	} catch (error) {
		next(error);
	}
};

export const eliminarProducto = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = Number(req.params['id']);
		const eliminado = await CatalogoModel.eliminar(id);
		console.log(`Producto ${id} eliminado:`, eliminado);

		if (!eliminado) {
			res.status(404).json({ message: 'Producto no encontrado' });
			return;
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
