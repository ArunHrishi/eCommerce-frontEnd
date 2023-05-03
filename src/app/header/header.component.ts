import { Component, OnInit } from '@angular/core';
import { ApiService } from '../products/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  cartItems:number=0

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.cartItemsCount
    .subscribe(
      (data:any)=>{
        console.log(data);
        this.cartItems = data
      }
    )
  }

  search(event:any){
    // console.log(event.target.value);
    // to assign new value to behavior subject use next method
    this.api.searchTerm.next(event.target.value)
  }
}
