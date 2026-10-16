import type { NextFunction, Request, Response } from 'express';
import { CarritoModel, type CarritoInput } from '../models/carrito.model';

export const obtenerCarritos = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const carritos = await CarritoModel.obtenerTodos();
		console.log('Carritos obtenidos:', carritos);
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
		const id = Number(req.params['id']);
		const carrito = await CarritoModel.obtenerPorId(id);
		console.log('Carrito solicitado:', carrito);

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
		const clienteId = Number(req.params['clienteId']);
		const carrito = await CarritoModel.obtenerPorClienteId(clienteId);
		console.log(`Carrito para cliente ${clienteId}:`, carrito);

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
		console.log('Carrito creado:', nuevoCarrito);
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
		const id = Number(req.params['id']);
		const carrito = await CarritoModel.actualizar(
			id,
			req.body as CarritoInput,
		);
		console.log('Carrito actualizado:', carrito);

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
		const id = Number(req.params['id']);
		const eliminado = await CarritoModel.eliminar(id);
		console.log(`Carrito ${id} eliminado:`, eliminado);

		if (!eliminado) {
			res.status(404).json({ message: 'Carrito no encontrado' });
			return;
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
