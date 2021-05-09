import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfirmedValidator } from 'src/app/validator';
import { Upload } from 'src/clases/upload';
import { User } from 'src/clases/user';
import { AuthServiceService } from 'src/services/auth-service.service';
import { CameraService } from 'src/services/camera/camera.service';
import { ImagepickerService } from 'src/services/imagepicker/imagepicker.service';
import { UploadService } from 'src/services/upload/upload.service';
import { Usuario } from '../../../clases/usuario';
declare let window: any;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  private userForm: FormGroup;
  formImage: string;
  displayImage: string;
  subioFoto: boolean;
  mock: boolean;
  newUser: Usuario = {
    nombre: "",
    apellido: "",
    password: "",
    documento: null,
    correo: "",
    isCreated: false,
    isAdmin: false,
    img_src: ''
  };
  passConfirm: string;
  currentUser: User;
  showForm:boolean = true;
  showSuccess: boolean = false;
  showSpinner: boolean = false;

  get nombre() {
    return this.userForm.get('nombre');
  }

  get apellido() {
    return this.userForm.get('apellido');
  }
  get documento() {
    return this.userForm.get('documento');
  }
  get password() {
    return this.userForm.get('password');
  }
  constructor(
    private formBuilder: FormBuilder,
    private cameraSrv: CameraService,
    public authSrv: AuthServiceService,
    public uploadSrv: UploadService,
    public pickerSrv: ImagepickerService
  ) {
    this.userForm = this.formBuilder.group(
      {
        nombre: [
          this.newUser?.nombre,
          Validators.compose([
            Validators.pattern('[a-zA-Zs]+$'),
            Validators.required,
          ]),
        ],
        apellido: [
          this.newUser?.apellido,
          Validators.compose([
            Validators.pattern('[a-zA-Zs]+$'),
            Validators.required,
          ]),
        ],
        email: [
          this.newUser?.correo,
          Validators.compose([
            Validators.email,
            Validators.required,
          ]),
        ],
        password: [this.newUser?.password, Validators.required],
        passwordconfirm: [this.passConfirm, Validators.required],
        documento: [
          this.newUser?.documento,
          Validators.compose([
            Validators.required,
            Validators.maxLength(8),
            Validators.minLength(8),
          ]),
        ],
      },
      { validator: ConfirmedValidator('password', 'passwordconfirm') }
    );

    this.userForm.reset();
  }

  ngOnInit() {
    const user$ = this.authSrv.getCurrentUserId().subscribe((data) => {
      this.currentUser = data;
      this.authSrv.getRole(data.uid).subscribe((userData) => {
        this.currentUser.profile = userData;
      });
    });
    this.displayImage = '../../assets/add-user.png';
    this.subioFoto = false;
    this.mock = false;
  }

  ReadQrCode() {
    // Optionally request the permission early
    window.cordova.plugins.barcodeScanner.scan(
      (result) => {
        console.log('Read result' + result.text);
        var dniData = result.text.split('@');
        console.log('Split result' + dniData[2] + dniData[1] + dniData);
        this.userForm.patchValue({
          nombre: this.capitalize(dniData[2].toLowerCase()),
          apellido: this.capitalize(dniData[1].toLowerCase()),
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
    this.cameraSrv
      .OpenCamera()
      .then((data) => {
        console.log('Home - Camera service - return :' + data);
        this.formImage = data;
        this.displayImage = 'data:image/png;base64,' + data;
        this.subioFoto = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  CambiarImagen(fullname: string) {
    this.displayImage = '../../assets/add-user.png';
    this.newUser.img_src = '';
    this.subioFoto = false;
    //this.uploadSrv.loadToStorage(this.formImage, fullname);
  }

  mockImage() {
    this.displayImage =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    this.subioFoto = true;
  }

  GuardarUsuario() {
      this.newUser.isCreated = false;
      this.newUser.isAdmin = false;
      this.newUser.img_src = this.subioFoto ?  this.formImage : "";
      this.uploadSrv.loadToStorage(this.newUser);
      this.userForm.reset();
this.cleanForm();
      this.showForm = false;
      this.showSpinner = true;
      setTimeout(() => {
        this.showSpinner = false;
        this.showSuccess = true;
      }, 2500);
      setTimeout(() => {
        this.showSuccess = false
        this.showForm = true;
      }, 6000);

  }

  cleanForm(){
    this.subioFoto = false;
    this.displayImage = '../../assets/add-user.png';
    this.newUser = {
      nombre: "",
      apellido: "",
      password: "",
      documento: null,
      correo: "",
      isCreated: false,
      isAdmin: false,
      img_src: ''
    };
  }

  capitalize(text:string){
    return text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  }

  SubirImagen(){
    this.pickerSrv.SeleccionarImagen().then( data =>{
      this.formImage = data;
      this.displayImage = 'data:image/png;base64,' + data;
      this.subioFoto = true;
    })
  }

  LogOut(){
    this.authSrv.SignOut();
  }
}
