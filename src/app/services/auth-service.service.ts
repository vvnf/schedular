import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, AlertController, ToastController, LoadingController, Platform } from '@ionic/angular';

import {Storage} from "@ionic/storage";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  isLoggedIn: Boolean;
  user: any;

  constructor(
    public platform: Platform,
    public loadingController: LoadingController,
    public storage: Storage,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
  ) { }

  async presentLoading() {
    const loader = await this.loadingController.create({
        message: "Fetching data..."
    });
    return loader.present();
  }

  async dissmissLoading() {
    await this.loadingController.dismiss();
  }

  registerUser(value){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err))
    })
   }
 
   loginUser(value){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err))
    })
   }
 
   logoutUser(){
     return new Promise((resolve, reject) => {
       if(this.afAuth.auth.currentUser){
        this.afAuth.auth.signOut()
         .then(() => {
           console.log("LOG Out");
           resolve();
         }).catch((error) => {
           reject();
         });
       }
     })
   }
 
   userDetails(){
     return this.afAuth.auth.currentUser;
   }

}
