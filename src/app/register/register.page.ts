import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthServiceService } from '../services/auth-service.service';
import { NavController } from '@ionic/angular';

import { CloudStoreService } from '../services/cloud-store.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
 
  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
    ],
    'userType': [
      { type: 'required', message: 'UserType is required.' },
    ],
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Enter a valid email.' }
   ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
 };

  constructor(
    private navCtrl: NavController,
    private authService: AuthServiceService,
    private formBuilder: FormBuilder,
    private cloudStore: CloudStoreService,
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      userType: new FormControl('', Validators.compose([
        Validators.required,
      ])),
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

  tryRegister(value){
    //console.log(value);
    this.authService.registerUser(value)
     .then(res => {
       //console.log(res);
       //console.log('USR Details : ', this.authService.userDetails());
        this.cloudStore.create_NewUser(this.authService.userDetails().uid,value);
       this.errorMessage = "";
       alert("Your account has been created. Please log in.");
       this.validations_form.reset();
       //this.successMessage = "Your account has been created. Please log in.";
     }, err => {
       console.log(err);
       alert(err.message);
       //this.errorMessage = err.message;
       //this.successMessage = "";
     });
  }
 
  goLoginPage(){
    this.navCtrl.navigateBack('');
  }

}
