import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// A interface do Produto pode ficar no mesmo arquivo ou ser movida para um arquivo de "model" depois.
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  quantityInStock: number;
  lastUpdated: Date;
}

export type CreateProductDto = Omit<Product, 'id' | 'lastUpdated'>;

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private apiUrl = 'http://localhost:5141/api/products'; 

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  
  createProduct(productData: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productData);
  }

  getProductById(id: string): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Product>(url);
  }

  updateProduct(id: string, productData: Product): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, productData);
  }
}