import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { routerTransition } from 'src/app/router.animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [routerTransition()]
})
export class RegisterComponent  {
  registerForm: FormGroup<{ username: FormControl<string | null>; email: FormControl<string | null>; password: FormControl<string | null>; confirmPassword: FormControl<string | null>; }>;
  constructor(private registerServ: RegisterService,private router: Router, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  


  register(username: string, email: string, password: string, confirmPassword: string ) {
    this.registerServ.do_register({
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    }).subscribe({
      next: res => {
        this.registerServ.access = res.access;
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(this.registerServ.access);
        try {
          this.registerServ.current_user_id = decodedToken.user_id;
          console.log(decodedToken.user_id);
          this.router.navigate(['/login']); // navigate to the login page
        } catch (Error) {}
      },
      error: err => console.error(err)
    });
  }
   
}
