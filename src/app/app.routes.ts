import { Routes } from '@angular/router';
import { DashboardComponent } from './buyer/dashboard/dashboard';

export const routes: Routes = [
  // =========================
  // Buyer Area
  // =========================
  {
    path: '',
    component: DashboardComponent
  },

  // =========================
  // Seller Area
  // =========================
  {
    path: 'seller',
    loadComponent: () =>
      import('./seller/dashboard/dashboard')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'seller/login',
    loadComponent: () =>
      import('./seller/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'seller/signup',
    loadComponent: () =>
      import('./seller/signup/signup')
        .then(m => m.SignupComponent)
  }
];
