import type { Carrito } from '../models/carrito.model';
import type { Producto } from '../models/catalogo.model';
import type { Categoria } from '../models/categoria.model';
import type { Cliente } from '../models/cliente.model';

/* =========================================================================
   DATOS HARCODEADOS: CLIENTES
   ========================================================================= */
export const clientesDB: Cliente[] = [
	{
		id: 1,
		nombre: 'Juan Perez',
		cedula: '1001234567',
		direccion: 'Calle 10 # 5-20',
		telefono: '3001234567',
	},
	{
		id: 2,
		nombre: 'Maria Gomez',
		cedula: '1002345678',
		direccion: 'Carrera 15 # 45-10',
		telefono: '3102345678',
	},
	{
		id: 3,
		nombre: 'Carlos Rodriguez',
		cedula: '1003456789',
		direccion: 'Avenida 68 # 26-50',
		telefono: '3203456789',
	},
	{
		id: 4,
		nombre: 'Ana Martinez',
		cedula: '1004567890',
		direccion: 'Calle 80 # 11-30',
		telefono: '3154567890',
	},
	{
		id: 5,
		nombre: 'Pedro Lopez',
		cedula: '1005678901',
		direccion: 'Carrera 7 # 32-15',
		telefono: '3185678901',
	},
];

let siguienteIdCliente = clientesDB.length + 1;
export const obtenerSiguienteId = (): number => siguienteIdCliente++;

/* =========================================================================
   DATOS HARCODEADOS: CATEGORÍAS
   ========================================================================= */
export const categoriasDB: Categoria[] = [
	{
		id: 1,
		nombre: 'Salas',
		descripcion: 'Sofás, sillones reclinables, mesas de centro y modulares para tu sala de estar.',
		imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
		cantidadProductos: 3,
	},
	{
		id: 2,
		nombre: 'Comedores',
		descripcion: 'Mesas elegantes de roble y cristal, sillas tapizadas y vitrinas modernas.',
		imagen: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
		cantidadProductos: 2,
	},
	{
		id: 3,
		nombre: 'Dormitorios',
		descripcion: 'Camas King y Queen, mesas de noche, armarios y cómodas funcionales.',
		imagen: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
		cantidadProductos: 2,
	},
	{
		id: 4,
		nombre: 'Oficina y Estudio',
		descripcion: 'Escritorios ergonómicos, libreros flotantes y sillas ejecutivas de alto confort.',
		imagen: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
		cantidadProductos: 2,
	},
];

let siguienteIdCategoria = categoriasDB.length + 1;
export const obtenerSiguienteIdCategoria = (): number => siguienteIdCategoria++;

/* =========================================================================
   DATOS HARCODEADOS: CATÁLOGO DE PRODUCTOS (MUEBLES)
   ========================================================================= */
export const catalogoDB: Producto[] = [
	{
		id: 1,
		nombre: 'Sofá Seccional Nórdico Velvet',
		descripcion: 'Sofá tapizado en tela tipo terciopelo de alta resistencia con estructura de pino canadiense.',
		categoria: 'Salas',
		precio: 1850000,
		material: 'Pino y Terciopelo',
		stock: 8,
		imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
	},
	{
		id: 2,
		nombre: 'Mesa de Centro Rústica Roble',
		descripcion: 'Mesa redonda elaborada en roble macizo con acabado natural y base metálica electroestática.',
		categoria: 'Salas',
		precio: 420000,
		material: 'Roble macizo y Metal',
		stock: 12,
		imagen: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
	},
	{
		id: 3,
		nombre: 'Poltrona Giratoria Confort',
		descripcion: 'Sillón individual giratorio 360° tapizado en lino texturizado con espuma de alta densidad.',
		categoria: 'Salas',
		precio: 680000,
		material: 'Lino y Acero',
		stock: 5,
		imagen: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80',
	},
	{
		id: 4,
		nombre: 'Comedor Imperial 6 Puestos',
		descripcion: 'Juego de mesa rectangular de madera teca con 6 sillas tapizadas en tela repelente a líquidos.',
		categoria: 'Comedores',
		precio: 2450000,
		material: 'Teca y Tela antifluido',
		stock: 4,
		imagen: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
	},
	{
		id: 5,
		nombre: 'Buffet Aparador Escandinavo',
		descripcion: 'Mueble organizador para vajilla con 3 puertas corredizas y detalles en madera ranurada.',
		categoria: 'Comedores',
		precio: 890000,
		material: 'MDF melamínico y Cedro',
		stock: 6,
		imagen: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
	},
	{
		id: 6,
		nombre: 'Cama King Size Flotante con Cabecero',
		descripcion: 'Cama matrimonial con estructura suspendida, luces LED cálidas indirectas y cabecero acolchado.',
		categoria: 'Dormitorios',
		precio: 2100000,
		material: 'Roble y Cuero sintético',
		stock: 3,
		imagen: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
	},
	{
		id: 7,
		nombre: 'Mesa de Noche Minimalista Dúo',
		descripcion: 'Set de 2 mesas de noche con gaveta de cierre lento y patas cónicas de fresno.',
		categoria: 'Dormitorios',
		precio: 360000,
		material: 'Fresno y Laqueado blanco',
		stock: 10,
		imagen: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=600&q=80',
	},
	{
		id: 8,
		nombre: 'Escritorio Home Office Roble & Acero',
		descripcion: 'Escritorio con pasacables integrado, cajón organizador lateral y superficie amplia de 140cm.',
		categoria: 'Oficina y Estudio',
		precio: 750000,
		material: 'Madera tratada y Acero negro',
		stock: 9,
		imagen: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
	},
	{
		id: 9,
		nombre: 'Silla Ergonómica Ejecutiva Lumbar',
		descripcion: 'Silla con soporte lumbar ajustable, descansabrazos 3D y malla transpirable de alto flujo.',
		categoria: 'Oficina y Estudio',
		precio: 590000,
		material: 'Malla mesh y Base de nylon',
		stock: 14,
		imagen: 'https://images.unsplash.com/photo-1580481077195-c3f9950661b6?auto=format&fit=crop&w=600&q=80',
	},
];

let siguienteIdCatalogo = catalogoDB.length + 1;
export const obtenerSiguienteIdCatalogo = (): number => siguienteIdCatalogo++;

/* =========================================================================
   DATOS HARCODEADOS: CARRITO DE COMPRAS
   ========================================================================= */
export const carritoDB: Carrito[] = [
	{
		id: 1,
		clienteId: 1,
		clienteNombre: 'Juan Perez',
		items: [
			{
				productoId: 1,
				nombre: 'Sofá Seccional Nórdico Velvet',
				precio: 1850000,
				cantidad: 1,
				total: 1850000,
				imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
			},
			{
				productoId: 2,
				nombre: 'Mesa de Centro Rústica Roble',
				precio: 420000,
				cantidad: 1,
				total: 420000,
				imagen: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
			},
		],
		total: 2270000,
		totalItems: 2,
	},
	{
		id: 2,
		clienteId: 2,
		clienteNombre: 'Maria Gomez',
		items: [
			{
				productoId: 8,
				nombre: 'Escritorio Home Office Roble & Acero',
				precio: 750000,
				cantidad: 1,
				total: 750000,
				imagen: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
			},
			{
				productoId: 9,
				nombre: 'Silla Ergonómica Ejecutiva Lumbar',
				precio: 590000,
				cantidad: 2,
				total: 1180000,
				imagen: 'https://images.unsplash.com/photo-1580481077195-c3f9950661b6?auto=format&fit=crop&w=600&q=80',
			},
		],
		total: 1930000,
		totalItems: 3,
	},
];

let siguienteIdCarrito = carritoDB.length + 1;
export const obtenerSiguienteIdCarrito = (): number => siguienteIdCarrito++;