import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService, CreateProductDto } from '../products/product';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-create.html',
  styleUrl: './product-create.scss'
})
export class ProductCreate {
productForm = new FormGroup({    
    sku: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    initialStock: new FormControl(0, [Validators.required, Validators.min(0)])
  });

  // 1. INJETE OS SERVIÇOS NO CONSTRUTOR
  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  // 2. CRIE O MÉTODO DE SUBMISSÃO
  onSubmit() {
    // Se o formulário for inválido, não faz nada.
    if (this.productForm.invalid) {
      return;
    }

    // Pega os valores do formulário e os trata como nosso DTO de criação.
    const productData = this.productForm.value as CreateProductDto;

    this.productService.createProduct(productData)
      .subscribe({
        next: () => {
          // Em caso de sucesso, navega de volta para a lista de produtos.
          this.router.navigate(['/products']);
        },
        error: (err) => {
          // Em caso de erro, apenas mostra no console por enquanto.
          console.error('Erro ao criar produto:', err);
        }
      });
  }
}
