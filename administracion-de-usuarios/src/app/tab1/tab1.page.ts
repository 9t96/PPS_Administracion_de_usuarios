import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let window: any;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private userForm : FormGroup;

  constructor( private formBuilder: FormBuilder ) {
    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.pattern("[a-zA-Z\s]+$"),Validators.required])],
      apellido: ['', Validators.compose([Validators.pattern("[a-zA-Z\s]+$"),Validators.required])],
      password: ['', Validators.required],
      passwordconfirm: ['', Validators.required],
      documento: ['', Validators.required]
    });
  }

  

  ReadQrCode() {
    // Optionally request the permission early
    window.cordova.plugins.barcodeScanner.scan(
      result => {
        console.log("Read result" + result.text);
        var dniData = result.text.split("@");
        console.log("Split result" + dniData[2] + dniData[1] + dniData);
        this.userForm.patchValue({
          nombre: dniData[2],
          apellido: dniData[1],
          documento: dniData[4]
        });
      },
      err => console.error(err),
      {
        showTorchButton: true,
        prompt: "Scan your code",
        formats: "PDF_417",
        resultDisplayDuration: 0
      }
    );
  }

  guardar(){}

}
