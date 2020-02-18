import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Storage} from '@ionic/storage';
import { CloudStoreService } from '../services/cloud-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  public taskForm: FormGroup;
  public loggedinUser:any;
  public allEmpDataSubscriber: Subscription;
  public tasksSubscriber: Subscription;


  public allEmp = [];
  public tasks=[];

  public tasksDates=[];

  constructor(
    public formBuilder: FormBuilder,
    public storage: Storage,
    private cloudStore: CloudStoreService,
  ) { 
    this.taskForm = this.formBuilder.group({
      creatorsUserID:[],
      title: [],
      description: [],
      fromDate: [],
      toDate: [],
      hours:[],
      assignTo:[],
    });
  }

  ngOnInit() {
    this.storage.get('user').then((user) => {
      console.log('USER :', user);
      this.loggedinUser= user;
      this.tasksSubscriber = this.cloudStore.getTaksIcreated(this.loggedinUser).subscribe(data=>{
        this.tasks = data.map(e => {
          return {
            id: e.payload.doc.id,
            title:e.payload.doc.data()['title'],
            fromDate: e.payload.doc.data()['fromDate'],
            toDate : e.payload.doc.data()['toDate'],
            tasksDates: this.getDates(new Date(e.payload.doc.data()['fromDate']), new Date(e.payload.doc.data()['toDate'])),
          };
      });
      });
      
    });

    

    // for(let i=0; i<this.tasks.length; i++){
    //   this.tasksDates['id']= this.tasks[i].id;
    //   this.tasksDates['datesArr'] = this.getDates(new Date(this.tasks[i].fromDate), new Date(this.tasks[i].toDate));
    // }

    this.allEmpDataSubscriber = this.cloudStore.getAllEmp().subscribe(data=>{
      this.allEmp = data.map(e => {
          return {
            id: e.payload.doc.id,
            email : e.payload.doc.data()['email'],
            name : e.payload.doc.data()['name'],
          };
      });
    });

    
  }
  checkIftaskAlreadyexist(fromDate, toDate){
    // console.log('func : ',fromDate,toDate);
    for(let i=0; i<this.tasks.length; i++){
      console.log('func : ',fromDate,toDate);
      if(this.tasks[i].tasksDates.includes(fromDate)  || this.tasks[i].tasksDates.includes(toDate)){
        return true;
      }
    }
  }

  createTask(form){
    if(form.fromDate < form.toDate){
      if(this.checkIftaskAlreadyexist(this.toYYYYMMDD(new Date(form.fromDate)), this.toYYYYMMDD(new Date(form.toDate)))){
        alert('You already have task created in the selected dates.');
      }
      else{
        form.creatorsUserID = this.loggedinUser;
          this.cloudStore.createTask(form)
          .then(data=>{
            alert('Task created Successfully');
            this.taskForm.reset();
          });
          console.log('Form Submit : ', form);
      }
    }
    else {
      alert('fromDate should be less thatn toDate');
    }
    

  }


toYYYYMMDD(d) {
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 101).toString().slice(-2);
    var dd = (d.getDate() + 100).toString().slice(-2);
    return yyyy +'-'+ mm +'-'+dd;
}

  // Returns an array of dates between the two dates
getDates(startDate, endDate) {
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  while (currentDate <= endDate) {
    
    dates.push(this.toYYYYMMDD(currentDate));
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}


// Usage

  ngDestroy() {
    this.allEmpDataSubscriber.unsubscribe();
    this.tasksSubscriber.unsubscribe();
  }


}
