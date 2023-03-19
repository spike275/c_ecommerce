import { Component,  } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from 'src/app/services/logout.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  isAuthenticated: boolean;
  

  constructor(private logoutService: LogoutService, private router: Router) {
    this.isAuthenticated = this.logoutService.isLoggedIn();
  }


  logout() {
    this.logoutService.do_logout();
    this.router.navigate(['/login']);
  }
}
