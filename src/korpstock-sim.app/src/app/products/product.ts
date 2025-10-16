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

@Injectable({
  providedIn: 'root'
})
// A classe continua se chamando ProductService, mesmo que o arquivo não tenha o sufixo.
export class ProductService {
  private apiUrl = 'http://localhost:5141/api/products'; 

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}