import { Router } from 'express';
import {
	actualizarProducto,
	crearProducto,
	eliminarProducto,
	obtenerCatalogo,
	obtenerProductoPorId,
} from '../controllers/catalogo.controller';

const router = Router();

router.get('/', obtenerCatalogo);
router.get('/:id', obtenerProductoPorId);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

export default router;
