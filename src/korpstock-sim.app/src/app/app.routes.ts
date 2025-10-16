import { Routes } from '@angular/router';
import { ProductList } from './products/product-list/product-list';
import { ProductCreate } from './product-create/product-create';

export const routes: Routes = [
  { path: 'products/new', component: ProductCreate },
  { path: 'products/edit/:id', component: ProductCreate },
  { path: 'products', component: ProductList },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];
