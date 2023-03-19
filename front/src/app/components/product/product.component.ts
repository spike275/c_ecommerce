import { Component, OnInit } from '@angular/core';
import IProduct from 'src/app/models/Product';
import { HomeService } from 'src/app/services/home.service';
import { ProductService } from 'src/app/services/product.service';




@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: IProduct = {
    name: '',
    brand: '',
    description: '',
    price: 0,
    image: ''
  };

  selectedFile: File | undefined;

  constructor(private productService: ProductService, private HomeService: HomeService) { }

  ngOnInit() {
  }

  addProduct() {
    this.productService.addProduct(this.product).subscribe(res => {
      console.log(res);
    });
  }

  async onImageSelected(event: any): Promise<void> {
    try {
      const imageDataUrl = await this.HomeService.handleImageSelection(event);
      // Use imageDataUrl as needed
    } catch (error) {
      console.error('Error handling image selection:', error);
    }
  }
}

