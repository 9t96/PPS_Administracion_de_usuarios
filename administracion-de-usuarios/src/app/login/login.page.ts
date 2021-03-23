import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';


class User{
  email:string;
  password:string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


 
  user: User;
  loginForm = this.fromBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
  })
  constructor(private authService: AuthServiceService, private router: Router, private fromBuilder: FormBuilder) { 
    this.user = new User();
  }

  ngOnInit() {
    
  }


  Login(){

    this.user.email = this.loginForm.get('email').value;
    this.user.password = this.loginForm.get('password').value;
    this.authService.SignIn(this.user.email, this.user.password).then( res =>{
      this.router.navigate(['tabs']);
    })
    .catch( err =>{ 
      console.log(err);
    })
  }

  testUser(accountNumber: number){
    switch (accountNumber) {
      case 1:
        this.loginForm.controls['email'].setValue('admin@admin.com') 
        this.loginForm.controls['password'].setValue('111111')
        break;
      case 2:
        this.loginForm.controls['email'].setValue('invitado@invitado.com') 
        this.loginForm.controls['password'].setValue('222222')
        break;
    }
    
  }

}
