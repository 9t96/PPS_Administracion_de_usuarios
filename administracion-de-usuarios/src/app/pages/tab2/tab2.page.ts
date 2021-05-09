import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/clases/usuario';
import { AuthServiceService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{


  showSpinner: boolean = true;
  users: Array<Usuario>

  ngOnInit(){
    this.reportSrv.getUsersToCreate().subscribe( user =>{
      this.users = user;
    })
  }
  constructor(public reportSrv: AuthServiceService) {
    setTimeout(() => {
      this.showSpinner = false;
    }, 1500);
  }

  LogOut(){
    this.reportSrv.SignOut();
  }

}
