import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {User} from '../clases/user';
import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { Usuario } from 'src/clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  public user$: Observable<User>;
  public dbRef: AngularFirestoreCollection<Usuario>

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.user$ = this.ngFireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afStore.doc(`usersProfile/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
    this.dbRef = this.afStore.collection("userList");
  }

  getUsersToCreate(){
    return this.dbRef.valueChanges({idField: "doc_id"});
  }

  UpdateState(doc_id: string, uid:string, usuario: Usuario){
    this.dbRef.doc(doc_id).delete();
    this.dbRef.doc(uid).set(usuario);
  }

  // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  CreaterUser(email:string,password:string){
    return this.ngFireAuth.createUserWithEmailAndPassword(email,password);
  }
  

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          "Password reset email has been sent, please check your inbox."
        );
      })
      .catch(error => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Get role
  getRole(uid) :Observable<Usuario> {
    return this.afStore.doc<Usuario>(`usersProfile/${uid}`).valueChanges();
  }

  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem("user");
      this.router.navigate(["login"]);
    });
  }

  getCurrentUserId(): Observable<User> {
    return this.ngFireAuth.authState.pipe(first());
  }
}

