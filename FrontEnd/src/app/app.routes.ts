import { Routes } from '@angular/router';
import { MenuComponent } from './views/menu/menu.component';
import { Carrito } from './views/carrito/carrito';
import { Catalogo } from './views/catalogo/catalogo';
import { Categorias } from './views/categorias/categorias';
import { Clientes } from './views/clientes/clientes';
import { Contacto } from './views/contacto/contacto';
import { Inicio } from './views/inicio/inicio';
import { Login } from './views/login/login';
import { Registro } from './views/registro/registro';
import { Perfil } from './views/perfil/perfil';

export const routes: Routes = [
  // ── Rutas SIN menú (pantalla completa) ──────────────────
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  // ── Rutas CON menú (layout principal) ───────────────────
  {
    path: '',
    component: MenuComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio },
      { path: 'catalogo', component: Catalogo },
      { path: 'categorias', component: Categorias },
      { path: 'carrito', component: Carrito },
      { path: 'clientes', component: Clientes },
      { path: 'contacto', component: Contacto },
      { path: 'perfil', component: Perfil },
      { path: '**', redirectTo: 'inicio' },
    ],
  },
];
