import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Injectable({
  providedIn: 'root'
})
export class CameraService {


constructor(private camera: Camera) { }

options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true
}

OpenCamera(){
  return this.camera.getPicture(this.options).then( imageData => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64 (DATA_URL):
    console.log( "Camera Service Lectura: " + imageData)
    return "data:image/png;base64," +imageData;
   }, (err) => {
    return err;
   });
}
}
