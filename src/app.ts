import cors from 'cors';
import express from 'express';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import carritoRoutes from './routes/carrito.routes';
import catalogoRoutes from './routes/catalogo.routes';
import categoriasRoutes from './routes/categorias.routes';
import clientesRoutes from './routes/clientes.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
	res.on('finish', () => {
		console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode}`);
	});
	next();
});

app.get('/api/v1/health', (_req, res) => {
	res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/catalogo', catalogoRoutes);
app.use('/api/v1/categorias', categoriasRoutes);
app.use('/api/v1/carrito', carritoRoutes);

app.use(errorHandler);

export default app;
