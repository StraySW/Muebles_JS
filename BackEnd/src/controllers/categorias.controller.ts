import type { NextFunction, Request, Response } from 'express';
import { CategoriaModel, type CategoriaInput } from '../models/categoria.model';

export const obtenerCategorias = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const categorias = await CategoriaModel.obtenerTodas();
		console.log('Categorías obtenidas:', categorias);
		res.status(200).json(categorias);
	} catch (error) {
		next(error);
	}
};

export const obtenerCategoriaPorId = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = Number(req.params['id']);
		const categoria = await CategoriaModel.obtenerPorId(id);
		console.log('Categoría solicitada:', categoria);

		if (!categoria) {
			res.status(404).json({ message: 'Categoría no encontrada' });
			return;
		}

		res.status(200).json(categoria);
	} catch (error) {
		next(error);
	}
};

export const crearCategoria = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const nuevaCategoria = await CategoriaModel.crear(req.body as CategoriaInput);
		console.log('Categoría creada:', nuevaCategoria);
		res.status(201).json(nuevaCategoria);
	} catch (error) {
		next(error);
	}
};

export const actualizarCategoria = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = Number(req.params['id']);
		const categoria = await CategoriaModel.actualizar(
			id,
			req.body as CategoriaInput,
		);
		console.log('Categoría actualizada:', categoria);

		if (!categoria) {
			res.status(404).json({ message: 'Categoría no encontrada' });
			return;
		}

		res.status(200).json(categoria);
	} catch (error) {
		next(error);
	}
};

export const eliminarCategoria = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = Number(req.params['id']);
		const eliminada = await CategoriaModel.eliminar(id);
		console.log(`Categoría ${id} eliminada:`, eliminada);

		if (!eliminada) {
			res.status(404).json({ message: 'Categoría no encontrada' });
			return;
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
