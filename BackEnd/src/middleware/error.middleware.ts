import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
	error,
	req,
	res,
	_next,
) => {
	console.error(`[Error] ${req.method} ${req.originalUrl}:`, error);
	res.status(500).json({
		message: 'Error interno del servidor',
		detalles: error?.message || String(error),
	});
};
