import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { AngularFireStorage, AngularFireUploadTask} from "@angular/fire/storage";
import { Upload } from 'src/clases/upload';
import { AuthServiceService } from '../auth-service.service';
import { Usuario } from 'src/clases/usuario';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  newName: string;
  dbRef: AngularFirestoreCollection<any>;
  currentUid: string;
  timeStamp: Number;
  fullName: string;
  constructor(
  private db: AngularFirestore,
  private fStorage: AngularFireStorage
  ) {
    this.dbRef = this.db.collection("userList");
  }
  loadToStorage(newUser: Usuario) {
    this.timeStamp = new Date().getTime();
    this.newName = `${this.timeStamp}.jpeg`;
    let ubicacion = `images/${this.newName}`;
    let image = `data:image/jpeg;base64,${newUser.img_src}`;
    return this.fStorage
      .ref(ubicacion)
      .putString(image, "data_url")
      .then((res) => {
        return this.GuardarUsuario(ubicacion, newUser); 
      })
      .catch((err) => {
        return err;
      });
  }

  GuardarUsuario(ubicacion: string,newUser: Usuario) {
     return firebase.default.storage()
      .ref(ubicacion)
      .getDownloadURL()
      .then((data) => {
        newUser.img_src = data;
        return this.dbRef.add(newUser);
      })
      
    }
} 
