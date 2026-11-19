import type { NextFunction, Request, Response } from 'express';
import { ClienteModel, type Cliente } from '../models/cliente.model';

export const obtenerClientes = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const clientes = await ClienteModel.obtenerTodos();
		res.status(200).json(clientes);
	} catch (error) {
		next(error);
	}
};

export const obtenerClientePorId = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = String(req.params['id']);
		const cliente = await ClienteModel.obtenerPorId(id);

		if (!cliente) {
			res.status(404).json({ message: 'Cliente no encontrado' });
			return;
		}

		res.status(200).json(cliente);
	} catch (error) {
		next(error);
	}
};

export const crearCliente = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const cliente = await ClienteModel.crear(req.body as Cliente);
		res.status(201).json(cliente);
	} catch (error) {
		next(error);
	}
};

export const actualizarCliente = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = String(req.params['id']);
		const cliente = await ClienteModel.actualizar(
			id,
			req.body as Cliente,
		);

		if (!cliente) {
			res.status(404).json({ message: 'Cliente no encontrado' });
			return;
		}

		res.status(200).json(cliente);
	} catch (error) {
		next(error);
	}
};

export const eliminarCliente = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const id = String(req.params['id']);
		const eliminado = await ClienteModel.eliminar(id);

		if (!eliminado) {
			res.status(404).json({ message: 'Cliente no encontrado' });
			return;
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
