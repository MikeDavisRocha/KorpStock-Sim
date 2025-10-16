import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { Product, ProductService } from '../product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
// Propriedade para armazenar a lista de produtos que virá da API.
  products: Product[] = [];

  // 1. Injetamos o nosso serviço no construtor.
  constructor(private productService: ProductService) { }

  // 2. ngOnInit é um "lifecycle hook", um método que o Angular chama
  //    automaticamente uma vez que o componente é inicializado.
  //    É o lugar perfeito para buscar dados iniciais.
  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      // 3. Quando os dados chegam da API, nós os atribuímos à nossa propriedade.
      this.products = data;
    });
  }
}
