import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service';
import {Storage} from "@ionic/storage";
import { CloudStoreService } from '../services/cloud-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userDataSubscriber: Subscription;

  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthServiceService,
    private formBuilder: FormBuilder,
    public storage: Storage,
    private cloudStore: CloudStoreService,
  ) {
   }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };
 
 
  loginUser(value){
    this.authService.loginUser(value)
    .then(res => {
      console.log('authSERV',this.authService.userDetails().uid);
      this.errorMessage = "";
      this.storage.set('user', this.authService.userDetails().uid);
      this.userDataSubscriber = this.cloudStore.getUserDetails(this.authService.userDetails().uid).subscribe( data => {
        console.log('Fetch USER Data: ', data.payload.data()['name']);
        this.storage.set('userType', data.payload.data()['userType'])
        .then( res => {
          this.navCtrl.navigateForward('/index/tabs/home');
        });
        // 
      });
      
      //this.storage.set('user', user);
    }, err => {
      this.errorMessage = err.message;
    })
  }
 
  goToRegisterPage(){
    this.navCtrl.navigateForward('register');
  }

  ngDestroy() {
    this.userDataSubscriber.unsubscribe();
  }

}
