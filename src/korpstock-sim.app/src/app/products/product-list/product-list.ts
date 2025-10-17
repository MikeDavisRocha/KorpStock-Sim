import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product, ProductService } from '../product';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule,
    MatSnackBarModule, MatFormFieldModule, MatInputModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  displayedColumns: string[] = ['sku', 'name', 'quantityInStock', 'lastUpdated', 'actions'];
  // Propriedade para armazenar a lista de produtos que virá da API.
  dataSource = new MatTableDataSource<Product>();

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
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteProduct(id: string): void {
    const confirmation = window.confirm('Você tem certeza que deseja excluir este produto?');

    if (confirmation) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // A lógica de atualização da UI agora precisa atualizar o dataSource.data
          const currentData = this.dataSource.data;
          const filteredData = currentData.filter(product => product.id !== id);
          this.dataSource.data = filteredData; // Reatribui os dados para a tabela atualizar
          this.openSnackBar('Produto excluído com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao excluir produto:', err);
          this.openSnackBar('Erro ao excluir produto.');
        }
      });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
    });
  }
}
