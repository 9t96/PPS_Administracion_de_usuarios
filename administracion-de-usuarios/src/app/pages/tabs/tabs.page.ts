import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  isAdmin: boolean;
  constructor(public authSer: AuthServiceService) {}

  ngOnInit(){
    this.authSer.getCurrentUserId().subscribe( data =>{
      this.isAdmin = data.email == "admin@admin.com" ? true : false;
    })
  }
}
