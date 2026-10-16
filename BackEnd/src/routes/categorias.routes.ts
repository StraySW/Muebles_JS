import { Router } from 'express';
import {
	actualizarCategoria,
	crearCategoria,
	eliminarCategoria,
	obtenerCategoriaPorId,
	obtenerCategorias,
} from '../controllers/categorias.controller';

const router = Router();

router.get('/', obtenerCategorias);
router.get('/:id', obtenerCategoriaPorId);
router.post('/', crearCategoria);
router.put('/:id', actualizarCategoria);
router.delete('/:id', eliminarCategoria);

export default router;
