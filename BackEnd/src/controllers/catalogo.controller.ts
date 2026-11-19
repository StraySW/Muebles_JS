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
		const id = String(req.params['id']);
		const producto = await CatalogoModel.obtenerPorId(id);

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
		const id = String(req.params['id']);
		const producto = await CatalogoModel.actualizar(
			id,
			req.body as ProductoInput,
		);

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
		const id = String(req.params['id']);
		const eliminado = await CatalogoModel.eliminar(id);

		if (!eliminado) {
			res.status(404).json({ message: 'Producto no encontrado' });
			return;
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
