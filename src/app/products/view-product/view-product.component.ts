import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit{

  productId:string=""
  product:any={}

  // dependency injection
  constructor(private viewActivatedRoute:ActivatedRoute, private api:ApiService){}

  ngOnInit(): void {
    // to get path parameter from route
    this.viewActivatedRoute.params
    .subscribe((data:any)=>{
      console.log(data);
      this.productId = data.id
    })

    // call view product api
    this.api.viewProduct(this.productId)
    .subscribe((result:any)=>{
      console.log(result);
      this.product = result
    },
    (result:any)=>{
      alert(result.error)
    }
    )
  }

  // api add to wishlist
  addToWishlist(){
    const {id,title,price,image} = this.product
    // api
    this.api.addToWishlist(id,title,price,image)
    .subscribe(
      // 200
      (result:any)=>{
      alert(result)
    },
      // 400
      (result:any)=>{
        alert(result.error)
      }
    )
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
