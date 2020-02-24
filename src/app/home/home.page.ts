import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthServiceService } from '../services/auth-service.service';
import { CloudStoreService } from '../services/cloud-store.service';
import { Subscription } from 'rxjs';
import { UserData } from '../userData';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userID: string;
  userEmail: string;



  public userDataSubscriber: Subscription;
  public userData:UserData;
  public tasksSubscriber: Subscription;
  public tasks=[];

  public tasksSubscribermanager: Subscription;
  public tasksManager=[];

  public disp={};

  constructor(
    private navCtrl: NavController,
    private authService: AuthServiceService,
    private cloudStore: CloudStoreService,
    public storage: Storage,
  ) {}

ngOnInit(){
  if(this.authService.userDetails()){
    this.userID = this.authService.userDetails().uid;
    //console.log('USR Details : ', this.authService.userDetails());

    this.userDataSubscriber = this.cloudStore.getUserDetails(this.userID).subscribe( data => {
      // console.log('USER Data: ', data.payload.data()['name']);
      this.userData = {
        name:data.payload.data()['name'],
        email:data.payload.data()['email'],
        password: data.payload.data()['password'],
        userType:data.payload.data()['userType'],
      }
      this.disp = this.userData;
      console.log('USer Data: ', this.userData);
    });


    this.tasksSubscriber = this.cloudStore.getTasksAssignedTome(this.userID).subscribe(data=>{
      this.tasks = data.map(e => {
        //console.log('ttttasl: ',e.payload.doc.data());
        return {
          id: e.payload.doc.id,
          title:e.payload.doc.data()['title'],
          desc:e.payload.doc.data()['description'],
          startDay: e.payload.doc.data()['fromDateOg'],
          endDay: e.payload.doc.data()['toDateOg'],

          startDayDisp: e.payload.doc.data()['fromDate'],
          endDayDisp: e.payload.doc.data()['toDate'],

          startTime:e.payload.doc.data()['fromTimeOg'],
          endTime:e.payload.doc.data()['toTimeOg'],

          startTimeDisp:e.payload.doc.data()['fromTime'],
          endTimeDisp:e.payload.doc.data()['toTime'],


          // startTime: ((new Date(e.payload.doc.data()['fromDateOg'])).setTime((new Date(e.payload.doc.data()['fromTimeOg'])).getTime())),
          // endTime : ((new Date(e.payload.doc.data()['toDateOg'])).setTime((new Date(e.payload.doc.data()['toTimeOg'])).getTime())),
          allDay: false,
          //tasksDates: this.getDates(new Date(e.payload.doc.data()['fromDate']), new Date(e.payload.doc.data()['toDate'])),
        };
    });
  });


  this.tasksSubscribermanager = this.cloudStore.getTaksIcreated(this.userID).subscribe(data=>{
    this.tasksManager = data.map(e => {
      //console.log('ttttasl: ',e.payload.doc.data());
      return {
        id: e.payload.doc.id,
        title:e.payload.doc.data()['title'],
        desc:e.payload.doc.data()['description'],
        startDay: e.payload.doc.data()['fromDateOg'],
        endDay: e.payload.doc.data()['toDateOg'],

        startDayDisp: e.payload.doc.data()['fromDate'],
        endDayDisp: e.payload.doc.data()['toDate'],

        startTime:e.payload.doc.data()['fromTimeOg'],
        endTime:e.payload.doc.data()['toTimeOg'],

        startTimeDisp:e.payload.doc.data()['fromTime'],
        endTimeDisp:e.payload.doc.data()['toTime'],


        // startTime: ((new Date(e.payload.doc.data()['fromDateOg'])).setTime((new Date(e.payload.doc.data()['fromTimeOg'])).getTime())),
        // endTime : ((new Date(e.payload.doc.data()['toDateOg'])).setTime((new Date(e.payload.doc.data()['toTimeOg'])).getTime())),
        allDay: false,
        //tasksDates: this.getDates(new Date(e.payload.doc.data()['fromDate']), new Date(e.payload.doc.data()['toDate'])),
      };
  });
});



    
    // this.userEmail = this.authService.userDetails().email;
    // this.userID = this.authService.userDetails().uid;
  }else{
    this.navCtrl.navigateBack('');
  }
}

logout(){
  this.authService.logoutUser()
  .then(res => {
    console.log(res);
    this.storage.set('user',null);
    this.storage.set('userType',null);
    this.navCtrl.navigateBack('');
  })
  .catch(error => {
    console.log(error);
  })
}

ngDestroy() {
  this.userDataSubscriber.unsubscribe();
  this.tasksSubscriber.unsubscribe();
  this.tasksSubscribermanager.unsubscribe();
}

}
