import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

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

  getProducts(filter: string, page: number, pageSize: number): Observable<PagedResult<Product>> {
    // Usa HttpParams para construir a URL da query de forma segura
    const params = new HttpParams()
      .set('filter', filter)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<Product>>(this.apiUrl, { params });
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

  deleteProduct(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    // A API retorna 204 No Content, então o tipo de retorno é 'void'.
    return this.http.delete<void>(url);
  }
}