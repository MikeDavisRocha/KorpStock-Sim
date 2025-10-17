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

  deleteProduct(id: string): void {
    // 1. Usa a janela de confirmação nativa do navegador.
    const confirmation = window.confirm('Você tem certeza que deseja excluir este produto?');

    // 2. Se o usuário clicar em "OK", a variável será 'true'.
    if (confirmation) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // 3. Em caso de sucesso, atualiza a UI instantaneamente.
          //    Filtramos a lista, mantendo apenas os produtos cujo ID é DIFERENTE do que foi excluído.
          this.products = this.products.filter(product => product.id !== id);
          console.log('Produto excluído com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao excluir produto:', err);
        }
      });
    }
  }
}
