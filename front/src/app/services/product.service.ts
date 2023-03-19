import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import IProduct from '../models/Product';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  myServer = 'http://127.0.0.1:8000/products/';

  constructor(private srv: HttpClient, private logServ: LoginService) {}

  // getProducts(): Observable<IProduct[]> {
  //   // console.log('aaaaaaaa', this.logServ.access);
  //   let headers = {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${this.logServ.access}`,
  //   };
  //   const requestOptions = { headers: headers };
  //   return this.srv.get<IProduct[]>(this.myServer, requestOptions);
  // }

  addProduct(newProduct: IProduct): Observable<any> {
    console.log('first');
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.logServ.access}`,
    };
    const requestOptions = { headers: headers };
    return this.srv.post<IProduct>(this.myServer, newProduct, requestOptions);
  }
}