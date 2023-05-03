import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from "@angular/forms";
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  public payPalConfig?: IPayPalConfig;

  allProducts:any=[]
  cartTotalPrice:number = 0
  proceedToPaymentBtnClickedStatus:boolean = false
  username:string=""
  flat:string=""
  street:string=""
  state:string=""
  offerClickedStatus:boolean = false
  discountClickedStatus:boolean = false
  showSuccess:boolean = false
  showCancel:boolean = false
  showError:boolean = false
  showPaypal:boolean = false

  // address
  addressForm = this.fb.group({
    username:[''],
    flat:[''],
    street:[''],
    state:['']
  })

  constructor(private api:ApiService, private fb:FormBuilder){}

  ngOnInit(): void {
    this.api.getCart()
    .subscribe(
      // 200
      (result:any)=>{
        console.log(result);
        this.allProducts = result
        // call getCartTotal - total price
        this.getCartTotal()
      },
      // 400
      (result:any)=>{
        console.log(result.error);
      }
    )

    // paypal
    this.initConfig()
  }

  // getCartTotal
  getCartTotal(){
    let total = 0
    this.allProducts.forEach((item:any)=>{
      total += item.grandTotal
      this.cartTotalPrice = Math.ceil(total)
    })
  }

  // removeItem
  removeItem(id:any){
    this.api.removeCartItem(id)
    .subscribe(
      (result:any)=>{
        this.allProducts = result
        // cart count changer
        this.api.cartCount()
        // call getCartTotal - update total price
        this.getCartTotal()
        alert('Item removed successfully!!!')
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  // emptyCart
  emptyCart(){
    this.api.emptyCart().subscribe(
      (result:any)=>{
        this.allProducts = []
        // update cart6 total price
        this.getCartTotal()
        // update cart count
        this.api.cartCount()
        alert(result)
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  // quantityIncrement
  increment(id:any){
    this.api.incrementCartItem(id).subscribe(
      // 200
      (result:any)=>{
        this.allProducts = result
        // update total
        this.getCartTotal()
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  // quantityDecrement
  decrement(id:any){
    this.api.decrementCartItem(id).subscribe(
      // 200
      (result:any)=>{
        this.allProducts = result
        // update total
        this.getCartTotal()
        // update cart count
        this.api.cartCount()
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  // submitBtnClicked()
  submitBtnClicked(){
    // check address
    if(this.addressForm.valid){
      this.proceedToPaymentBtnClickedStatus = true
      this.username = this.addressForm.value.username||""
      this.flat = this.addressForm.value.flat||""
      this.street = this.addressForm.value.street||""
      this.state = this.addressForm.value.state||""
    }else{
      alert('Please enter valid inputs!!!')
    }
  }

  // offer clicked
  offerClicked(){
    this.offerClickedStatus = true
  }

  // discount10
  discount10(){
    let discount = Math.ceil(this.cartTotalPrice*10/100)
    this.cartTotalPrice-=discount
    this.discountClickedStatus = true
  }

  // discount10
  discount50(){
    let discount = Math.ceil(this.cartTotalPrice*50/100)
    this.cartTotalPrice-=discount
    this.discountClickedStatus = true
  }

  // pay pal payment method
  private initConfig(): void {
    this.payPalConfig = {
    currency: 'EUR',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '9.99'
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '9.99',
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any )=> {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
      // empty cart
      this.emptyCart()
      // hide paypal div
      this.showPaypal = false
      // hide proceedToPaymentBtnClickedStatus
      this.proceedToPaymentBtnClickedStatus = false
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
      this.showCancel = true;
      // hide paypal div
      this.showPaypal = false
    },
    onError: err => {
      console.log('OnError', err);
      this.showError = true;
      // hide paypal div
      this.showPaypal = false
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

  // makePayment
  makePayment(){
    this.showPaypal = true
  }
}
