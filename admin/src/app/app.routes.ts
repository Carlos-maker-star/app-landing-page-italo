import { Routes } from '@angular/router';
import { authGuard, invitadoGuard } from './core/auth/guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [invitadoGuard],
    title: 'Iniciar sesión · ISEVEN',
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard · ISEVEN',
        data: { titulo: 'Dashboard' },
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'productos',
        title: 'Productos · ISEVEN',
        data: { titulo: 'Productos' },
        loadComponent: () => import('./features/productos/producto-list').then((m) => m.ProductoList),
      },
      {
        path: 'productos/nuevo',
        title: 'Nuevo producto · ISEVEN',
        data: { titulo: 'Productos / Nuevo' },
        loadComponent: () => import('./features/productos/producto-form').then((m) => m.ProductoFormPage),
      },
      {
        path: 'productos/:id',
        title: 'Editar producto · ISEVEN',
        data: { titulo: 'Productos / Editar' },
        loadComponent: () => import('./features/productos/producto-form').then((m) => m.ProductoFormPage),
      },
      {
        path: 'categorias',
        title: 'Categorías · ISEVEN',
        data: { titulo: 'Categorías' },
        loadComponent: () => import('./features/categorias/categoria-list').then((m) => m.CategoriaList),
      },
      {
        path: 'configuracion',
        title: 'Configuración · ISEVEN',
        data: { titulo: 'Configuración' },
        loadComponent: () => import('./features/configuracion/configuracion').then((m) => m.ConfiguracionPage),
      },
      {
        path: 'perfil',
        title: 'Perfil · ISEVEN',
        data: { titulo: 'Perfil' },
        loadComponent: () => import('./features/perfil/perfil').then((m) => m.PerfilPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
