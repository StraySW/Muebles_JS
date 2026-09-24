import { Routes } from '@angular/router';
import { Carrito } from './views/carrito/carrito';
import { Catalogo } from './views/catalogo/catalogo';
import { Categorias } from './views/categorias/categorias';
import { Clientes } from './views/clientes/clientes';
import { Contacto } from './views/contacto/contacto';
import { Inicio } from './views/inicio/inicio';

export const routes: Routes = [
	{ path: '', redirectTo: 'catalogo', pathMatch: 'full' },
	{ path: 'inicio', component: Inicio },
	{ path: 'clientes', component: Clientes },
	{ path: 'catalogo', component: Catalogo },
	{ path: 'carrito', component: Carrito },
	{ path: 'categorias', component: Categorias },
	{ path: 'contacto', component: Contacto },
	{ path: '**', redirectTo: 'catalogo' },
];
