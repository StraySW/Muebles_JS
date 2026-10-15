import type { Cliente } from '../models/cliente.model';

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

let siguienteId = clientesDB.length + 1;

export const obtenerSiguienteId = (): number => siguienteId++;