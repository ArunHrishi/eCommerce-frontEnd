import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{

  allProducts:any=[]
  searchTerm:string=""

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.getAllProducts()
    .subscribe((result:any)=>{
      console.log(result);
      this.allProducts = result
    })

    // to get searchTerm from api.service
    this.api.searchTerm
    .subscribe((result:any)=>{
      this.searchTerm = result
      console.log(this.searchTerm);
    })

  }

  // addToCart(product)
  addToCart(product:any){
    // add {quantity:1} to product object
    Object.assign(product,{quantity:1})
    console.log(product);

    // api call
    this.api.addToCart(product)
    .subscribe(
      // 200
      (result:any)=>{
        // call cartCount
        this.api.cartCount()
        alert(result)
    },
      // 400
      (result:any)=>{
        alert(result.error)
      }
    )
  }
}
