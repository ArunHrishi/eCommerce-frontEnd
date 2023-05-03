import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // to hold searchTerm - behavior subject
  searchTerm = new BehaviorSubject('')

  // to hold cart count
  cartItemsCount = new BehaviorSubject(0)

  BASE_URL = 'https://e-commerce-b5bk.onrender.com'


  constructor(private http:HttpClient) {
    this.cartCount()
   }

  // get all products
  getAllProducts(){
    // api
    return this.http.get(`${this.BASE_URL}/products/all-products`)
  }

  // viewProducts
  viewProduct(id:any){
    // api
    return this.http.get(`${this.BASE_URL}/products/view-product/${id}`)
  }

  // add to wishlist
  addToWishlist(id:any,title:any,price:any,image:any){
    const body = {
      id,title,price,image
    }
    // api
    return this.http.post(`${this.BASE_URL}/wishlist/add-product`,body)
  }

  // get from wishlist
  getWishlist(){
    // api
    return this.http.get(`${this.BASE_URL}/wishlist/get-items`)
  }

  // remove wishlist item
  removeWishlistItem(id:any){
    // api
    return this.http.delete(`${this.BASE_URL}/wishlist/remove-item/${id}`)
  }

  // add to cart api - cart/add-product
  addToCart(product:any){
    // get id,title,image,price,quantity from product
    const body = {
      id:product.id,
      title:product.title,
      image:product.image,
      price:product.price,
      quantity:product.quantity
    }
    // api
    return this.http.post(`${this.BASE_URL}/cart/add-product`,body)
  }

  // cart/all-products
  getCart(){
    // api
    return this.http.get(`${this.BASE_URL}/cart/all-products`)
  }

  // cartCount
  cartCount(){
    this.getCart()
    .subscribe(
      (result:any)=>{
        this.cartItemsCount.next(result.length)
      }
    )
  }

  // remove cart item
  removeCartItem(id:any){
    // api
    return this.http.delete(`${this.BASE_URL}/cart/remove-item/${id}`)
  }

  // empty cart
  emptyCart(){
    // api
    return this.http.delete(`${this.BASE_URL}/cart/remove-all-items`)
  }

  // increment cart item count
  incrementCartItem(id:any){
    // api
    return this.http.get(`${this.BASE_URL}/cart/increment-item/${id}`)
  }

  // decrement cart item count
  decrementCartItem(id:any){
    // api
    return this.http.get(`${this.BASE_URL}/cart/decrement-item/${id}`)
  }
}
