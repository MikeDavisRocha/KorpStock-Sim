import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product, ProductService } from '../product';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule,
    MatSnackBarModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  displayedColumns: string[] = ['sku', 'name', 'quantityInStock', 'lastUpdated', 'actions'];
  // Propriedade para armazenar a lista de produtos que virá da API.
  products: Product[] = [];

  // 1. Injetamos o nosso serviço no construtor.
  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  // 2. ngOnInit é um "lifecycle hook", um método que o Angular chama
  //    automaticamente uma vez que o componente é inicializado.
  //    É o lugar perfeito para buscar dados iniciais.
  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      // 3. Quando os dados chegam da API, nós os atribuímos à nossa propriedade.
      this.products = data;
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
    });
  }

  deleteProduct(id: string): void {
    const confirmation = window.confirm('Você tem certeza que deseja excluir este produto?');

    if (confirmation) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== id);
          this.openSnackBar('Produto excluído com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao excluir produto:', err);
          this.openSnackBar('Erro ao excluir produto.');
        }
      });
    }
  }
}
