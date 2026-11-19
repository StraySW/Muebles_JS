import type { NextFunction, Request, Response } from 'express';
import { CarritoModel, type CarritoInput } from '../models/carrito.model';

export const obtenerCarritos = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const carritos = await CarritoModel.obtenerTodos();
		res.status(200).json(carritos);
	} catch (error) {
		next(error);
	}
};

export const obtenerCarritoPorId = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = String(req.params['id']);
		const carrito = await CarritoModel.obtenerPorId(id);

		if (!carrito) {
			res.status(404).json({ message: 'Carrito no encontrado' });
			return;
		}

		res.status(200).json(carrito);
	} catch (error) {
		next(error);
	}
};

export const obtenerCarritoPorCliente = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const clienteId = String(req.params['clienteId']);
		const carrito = await CarritoModel.obtenerPorClienteId(clienteId);

		if (!carrito) {
			res.status(404).json({ message: 'Carrito no encontrado para este cliente' });
			return;
		}

		res.status(200).json(carrito);
	} catch (error) {
		next(error);
	}
};

export const crearCarrito = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const nuevoCarrito = await CarritoModel.crear(req.body as CarritoInput);
		res.status(201).json(nuevoCarrito);
	} catch (error) {
		next(error);
	}
};

export const actualizarCarrito = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = String(req.params['id']);
		const carrito = await CarritoModel.actualizar(
			id,
			req.body as CarritoInput,
		);

		if (!carrito) {
			res.status(404).json({ message: 'Carrito no encontrado' });
			return;
		}

		res.status(200).json(carrito);
	} catch (error) {
		next(error);
	}
};

export const eliminarCarrito = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = String(req.params['id']);
		const eliminado = await CarritoModel.eliminar(id);

		if (!eliminado) {
			res.status(404).json({ message: 'Carrito no encontrado' });
			return;
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
