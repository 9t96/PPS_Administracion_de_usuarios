import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/services/auth-service.service';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/clases/usuario';


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
  loginForm: FormGroup;
  usersToCreate: any;

  get name() {
    return this.loginForm.get("email");
  }

  get power() {
    return this.loginForm.get("password");
  }

  constructor(private authService: AuthServiceService, private router: Router, private fromBuilder: FormBuilder, public toastController: ToastController) { 
    this.user = new User();
  }

  ngOnInit() {
    this.loginForm = this.fromBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    })

    this.authService.getUsersToCreate().subscribe( data =>{
      this.usersToCreate = data;
      console.log(data);
    })
  }


  Login(){
    this.user.email = this.loginForm.get('email').value;
    this.user.password = this.loginForm.get('password').value;
    let hastocreate = this.usersToCreate.find( user =>{
      return user.email == this.user.email && user.isCreated == false
    })

    if (hastocreate) {
      if(this.user.password == hastocreate.password){
        this.authService.CreaterUser(this.user.email,this.user.password).then(data => {  
          hastocreate.password = "";
          this.authService.UpdateState(hastocreate.doc_id, data.user.uid, hastocreate);
          this.router.navigate(['tabs/tab2']);
        })
      }
    }
    else{
      this.authService.SignIn(this.user.email, this.user.password).then( res =>{
        if (this.user.email == "admin@admin.com") {
          this.router.navigate(['tabs/tab1']);
        } else {
          this.router.navigate(['tabs/tab2']);
        }
      })
      .catch( err =>{ 
        err.code == "auth/wrong-password" ? this.presentToast("Uno o mas campos son invalidos...") : this.presentToast("Ha ocurrido un error vuelva a intentar.")
      })
    }
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
      case 3:
        this.loginForm.controls['email'].setValue('usuario@usuario.com') 
        this.loginForm.controls['password'].setValue('333333')
        break;
      case 4:
        this.loginForm.controls['email'].setValue('anonimo@anonimo.com') 
        this.loginForm.controls['password'].setValue('444444')
        break;
      case 5:
        this.loginForm.controls['email'].setValue('tester@tester.com') 
        this.loginForm.controls['password'].setValue('555555')
        break;
    }
    
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      cssClass: 'toast-danger',
      position: 'top'
    });
    toast.present();
  }

}
