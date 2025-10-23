import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagedResult, Product, ProductService } from '../product';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule,
    MatSnackBarModule, MatFormFieldModule, MatInputModule, MatPaginatorModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  displayedColumns: string[] = ['sku', 'name', 'quantityInStock', 'lastUpdated', 'actions'];
  // Propriedade para armazenar a lista de produtos que virá da API.
  dataSource = new MatTableDataSource<Product>();

  totalCount = 0;
  pageSize = 10;

  private filterSubject = new Subject<string>();

  // 1. Injetamos o nosso serviço no construtor.
  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  // 2. ngOnInit é um "lifecycle hook", um método que o Angular chama
  //    automaticamente uma vez que o componente é inicializado.
  //    É o lugar perfeito para buscar dados iniciais.
  ngOnInit(): void {
    this.loadProducts();

    // Escuta as mudanças no filtro
    this.filterSubject.pipe(
      debounceTime(300), // Espera 300ms após o usuário parar de digitar
      distinctUntilChanged(), // Só emite se o valor for diferente do anterior
      tap(() => this.loadProducts()) // Chama o carregamento dos produtos
    ).subscribe();
  }

  loadProducts(page: number = 1, pageSize: number = this.pageSize): void {
    const filterValue = this.dataSource.filter || '';
    this.productService.getProducts(filterValue, page, pageSize)
      .subscribe((result: PagedResult<Product>) => {
        this.dataSource.data = result.items;
        this.totalCount = result.totalCount;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filterSubject.next(this.dataSource.filter);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    // +1 porque o paginator do Material é 0-based e nossa API é 1-based
    this.loadProducts(event.pageIndex + 1, event.pageSize);
  }

  deleteProduct(id: string): void {
    const confirmation = window.confirm('Você tem certeza que deseja excluir este produto?');
    if (confirmation) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.openSnackBar('Produto excluído com sucesso!');
          this.loadProducts(); // Recarrega os dados da página atual após a exclusão
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
