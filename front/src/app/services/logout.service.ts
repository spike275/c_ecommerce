import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  myServer = 'http://127.0.0.1:8000/logout/';
  access = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  do_logout() {
    return this.http.post(this.myServer, {}).subscribe(
      (res) => {
        this.setAccess(false);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  isLoggedIn() {
    return this.access.getValue();
  }

  setAccess(access: boolean) {
    this.access.next(access);
  }
}


