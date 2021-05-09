import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CameraService } from 'src/services/camera/camera.service';

declare let window: any;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  private userForm: FormGroup;
  formImage: string;
  subioFoto: boolean;
  mock: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private cameraSrv: CameraService
  ) {
    this.userForm = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([
          Validators.pattern('[a-zA-Zs]+$'),
          Validators.required,
        ]),
      ],
      apellido: [
        '',
        Validators.compose([
          Validators.pattern('[a-zA-Zs]+$'),
          Validators.required,
        ]),
      ],
      password: ['', Validators.required],
      passwordconfirm: ['', Validators.required],
      documento: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(8),
        ]),
      ],
    });
  }

  ngOnInit() {
    this.formImage = '../../assets/add-user.png';
    this.subioFoto = false;
    this.mock = true;
  }

  ReadQrCode() {
    // Optionally request the permission early
    window.cordova.plugins.barcodeScanner.scan(
      (result) => {
        console.log('Read result' + result.text);
        var dniData = result.text.split('@');
        console.log('Split result' + dniData[2] + dniData[1] + dniData);
        this.userForm.patchValue({
          nombre: dniData[2],
          apellido: dniData[1],
          documento: dniData[4],
        });
      },
      (err) => console.error(err),
      {
        showTorchButton: true,
        prompt: 'Scan your code',
        formats: 'PDF_417',
        resultDisplayDuration: 0,
      }
    );
  }

  TomarImagen() {
    if (!this.mock) {
      this.cameraSrv
        .OpenCamera()
        .then((data) => {
          console.log('Home - Camera service - return :' + data);
          this.formImage = data;
          this.subioFoto = true;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.mockImage();
    }
  }

  CambiarImagen(){
    this.subioFoto = false;
    this.formImage = '../../assets/add-user.png';
  }

  mockImage() {
    this.formImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    this.subioFoto = true;
      
  }
}
