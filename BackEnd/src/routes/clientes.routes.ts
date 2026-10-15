import { Router } from 'express';
import {
	actualizarCliente,
	crearCliente,
	eliminarCliente,
	obtenerClientePorId,
	obtenerClientes,
} from '../controllers/clientes.controller';

const router = Router();

router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;
