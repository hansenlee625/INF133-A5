import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'view-transactions',
    loadComponent: () => import('./pages/view-transactions/view-transactions.page').then((m) => m.ViewTransactionsPage),
  },
];
