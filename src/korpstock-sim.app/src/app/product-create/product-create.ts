import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService, Product, CreateProductDto } from '../products/product';

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
    quantityInStock: new FormControl(0, [Validators.required, Validators.min(0)])
  });

  isEditMode = false;
  private currentProductId: string | null = null;

  // 1. INJETE OS SERVIÇOS NO CONSTRUTOR
  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {
    // Escuta as mudanças nos parâmetros da rota
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // MODO DE EDIÇÃO
        this.isEditMode = true;
        this.currentProductId = id;
        this.productService.getProductById(id).subscribe(product => {
          // Preenche o formulário com os dados do produto buscado
          this.productForm.setValue({
            sku: product.sku,
            name: product.name,
            description: product.description,
            quantityInStock: product.quantityInStock
          });
        });
      }
    });
  }

  // 2. CRIE O MÉTODO DE SUBMISSÃO
  onSubmit() {
    // Se o formulário for inválido, não faz nada.
    if (this.productForm.invalid) {
      return;
    }
if (this.isEditMode && this.currentProductId) {
  const updatedProduct: Product = {
        id: this.currentProductId,
        lastUpdated: new Date(),
        ...this.productForm.value
      } as Product;
      this.productService.updateProduct(this.currentProductId, updatedProduct).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Erro ao atualizar produto:', err)
      });
    } else {
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
}