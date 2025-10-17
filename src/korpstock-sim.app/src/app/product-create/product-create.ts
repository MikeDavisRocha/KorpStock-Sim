import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService, Product, CreateProductDto } from '../products/product';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSnackBarModule],
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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

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

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000, // A notificação desaparecerá após 3 segundos
    });
  }

  // 2. CRIE O MÉTODO DE SUBMISSÃO
  onSubmit() {
    // Se o formulário for inválido, não faz nada.
    if (this.productForm.invalid) {
      return;
    }

    const successCallback = () => {
      this.openSnackBar('Produto salvo com sucesso!');
      this.router.navigate(['/products']);
    };
    const errorCallback = (err: any) => console.error('Erro ao salvar produto:', err);

    if (this.isEditMode && this.currentProductId) {
      const updatedProduct = { id: this.currentProductId, ...this.productForm.value } as Product;
      this.productService.updateProduct(this.currentProductId, updatedProduct)
        .subscribe({ next: successCallback, error: errorCallback });
    } else {
      const productData = this.productForm.value as CreateProductDto;
      this.productService.createProduct(productData)
        .subscribe({ next: successCallback, error: errorCallback });
    }
  }
}