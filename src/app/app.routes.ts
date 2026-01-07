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
  // Seller Auth
  // =========================
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
  },

  // =========================
  // Seller Shop
  // =========================
  {
    path: 'seller',
    redirectTo: 'seller/my-shop',
    pathMatch: 'full'
  },
  {
    path: 'seller/my-shop',
    loadComponent: () =>
      import('./seller/shop/my-shop/my-shop')
        .then(m => m.MyShopComponent)
  },
  {
    path: 'seller/my-shop/add-product',
    loadComponent: () =>
      import('./seller/shop/add-product/add-product')
        .then(m => m.AddProductComponent)
  },
  {
    path: 'seller/my-shop/my-products',
    loadComponent: () =>
      import('./seller/shop/my-products/my-products')
        .then(m => m.MyProductsComponent)
  },
  {
    path: 'seller/my-shop/my-orders',
    loadComponent: () =>
      import('./seller/shop/my-orders/my-orders')
        .then(m => m.MyOrdersComponent)
  }
];
