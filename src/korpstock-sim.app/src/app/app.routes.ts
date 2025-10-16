import { Routes } from '@angular/router';
import { ProductList } from './products/product-list/product-list';

export const routes: Routes = [
  { path: 'products', component: ProductList },
    { path: '', redirectTo: '/products', pathMatch: 'full' }
];
