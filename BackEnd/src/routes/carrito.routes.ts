import { Router } from 'express';
import {
	actualizarCarrito,
	crearCarrito,
	eliminarCarrito,
	obtenerCarritoPorCliente,
	obtenerCarritoPorId,
	obtenerCarritos,
} from '../controllers/carrito.controller';

const router = Router();

router.get('/', obtenerCarritos);
router.get('/:id', obtenerCarritoPorId);
router.get('/cliente/:clienteId', obtenerCarritoPorCliente);
router.post('/', crearCarrito);
router.put('/:id', actualizarCarrito);
router.delete('/:id', eliminarCarrito);

export default router;
