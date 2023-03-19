import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
  
})
export class LoginComponent {
  constructor(private loginServ: LoginService, private router: Router) {}

  login(username: string, password: string) {
    this.loginServ
      .do_login({
        username: username,
        password: password,
      })
      .subscribe((res) => (this.loginServ.access = res.access));

    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(this.loginServ.access);
    try {
      this.loginServ.current_user_id = decodedToken.user_id;
      console.log(decodedToken.user_id);
      this.router.navigate(['/home']);
    } catch (Error) {}
  }
}
