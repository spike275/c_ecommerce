import { Component } from '@angular/core';
import { LogoutService } from './services/logout.service';
import { routerTransition } from 'src/app/router.animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerTransition()]
})
export class AppComponent {
  isAuthenticated = false;

  constructor(private logoutService: LogoutService) {}

  ngOnInit() {
    // Subscribe to access variable in LogoutService
    this.logoutService.access.subscribe((access) => {
      this.isAuthenticated = access;
    });
    // Check if user is logged in on app startup
    this.isAuthenticated = this.logoutService.isLoggedIn();
  }

  logout() {
    // Call the logout service to log out the user
    this.logoutService.do_logout();
  }
}





// export class AppComponent implements OnInit{
//   constructor(private custSer: CustomerService, public loginServ: LoginService) {
//     if (loginServ.access.length > 1) {
//       custSer.getCustomers().subscribe((res) => console.log(res));
//     }
    
//   }
  
//   ngOnInit() {}

  

  
  
// }


// // title = '';

// //   ar: ICustomer[] = [];

// //   displayInfo = (stuName: string, ind: number) => {
// //     console.log(ind);
// //   };
// //   test() {
// //     console.log(this.loginServ.access);
//   }
//   getCustomers() {
//     this.custSer.getCustomers().subscribe((res) => (this.ar = res));
//   }