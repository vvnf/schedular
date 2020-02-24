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

  public workHourStartTime;
  public workHoursEndTime;


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
      fromTime:[],
      toTime:[],
      assignTo:[],
    });

    this.workHourStartTime = new Date();
    this.workHourStartTime.setHours(10);
    this.workHourStartTime.setMinutes(0);
    this.workHourStartTime.setSeconds(0);
    this.workHoursEndTime = new Date();
    this.workHoursEndTime.setHours(19);
    this.workHoursEndTime.setMinutes(0);
    this.workHoursEndTime.setSeconds(0);
  }

  ngOnInit() {
    this.storage.get('user').then((user) => {
      console.log('USER :', user);
      this.loggedinUser= user;
      this.tasksSubscriber = this.cloudStore.getTaks().subscribe(data=>{
        this.tasks = data.map(e => {
          return {
            id: e.payload.doc.id,
            title:e.payload.doc.data()['title'],
            fromDate: e.payload.doc.data()['fromDate'],
            toDate : e.payload.doc.data()['toDate'],
            fromDateOg: e.payload.doc.data()['fromDateOg'],
            toDateOg : e.payload.doc.data()['toDateOg'],
            fromTime:e.payload.doc.data()['fromTime'],
            toTime:e.payload.doc.data()['toTime'],
            fromTimeOg: e.payload.doc.data()['fromTimeOg'],
            toTimeOg : e.payload.doc.data()['toTimeOg'],
            tasksDates: this.getDates(new Date(e.payload.doc.data()['fromDateOg']), new Date(e.payload.doc.data()['toDateOg'])),
            assignedTo:e.payload.doc.data()['assignTo'],
            taskHours: this.calcTaskHours(new Date(e.payload.doc.data()['toTimeOg']), new Date(e.payload.doc.data()['fromTimeOg'])),
          };
        });
        console.log('Tasks : ', this.tasks);
      });
      
    });

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
  checkIftaskAlreadyexist(fromDate, toDate, fromTime, toTime, empID){
    // console.log('func : ',fromDate,toDate);
    for(let i=0; i<this.tasks.length; i++){
      if( this.tasks[i].assignedTo == empID){

        console.log('func : ',this.tasks[i].tasksDates.includes(fromDate) , this.tasks[i].tasksDates.includes(toDate));

        if(this.tasks[i].tasksDates.includes(fromDate)  || this.tasks[i].tasksDates.includes(toDate)){
          //console.log('TIME : ', new Date(fromTime).getTime(),  new Date(this.tasks[i].fromTimeOg).getTime() , new Date(toTime).getTime() , new Date(this.tasks[i].toTimeOg).getTime());
          //the entered date range falls in tasks date range

          if( ( new Date(fromTime).getTime() > new Date(this.tasks[i].fromTimeOg).getTime()) && (new Date(fromTime).getTime() < new Date(this.tasks[i].toTimeOg).getTime())
          || (new Date(toTime).getTime() > new Date(this.tasks[i].fromTimeOg).getTime()) && (new Date(toTime).getTime() < new Date(this.tasks[i].toTimeOg).getTime())
          ){
            console.log('Falss in the date and Time Range');
            return true;
          }
        }
        else{
          console.log('In False');
          return false;
        }

      }
      else {
        console.log('No Task in Employee Bucket');
          return false;
      }

    }
  }

  checkForHistoricTime(fromDate, fromTime)
  {
    if(new Date(fromDate).toLocaleDateString() == new Date().toLocaleDateString()) {//Check only if todays date

      if(new Date(fromTime).getTime() > new Date().getTime()){ // Check if time entered is before current time
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
    
  }


  // checkIfhrsComplete(fromDate, toDate, fromTime, toTime){


  //   return true;
  // }

  createTask(form){
    form.fromDateOg = form.fromDate;
    form.toDateOg = form.toDate;
    form.fromTimeOg = form.fromTime;
    form.toTimeOg = form.toTime;
    form.fromDate = new Date(form.fromDate).toLocaleDateString();
    form.toDate = new Date(form.toDate).toLocaleDateString();
    form.fromTime = new Date(form.fromTime).toLocaleTimeString();
    form.toTime = new Date(form.toTime).toLocaleTimeString();
    console.log(form);
    
if(form.title != null && form.description != null && form.fromDate != null && form.toDate != null && form.fromTime != null && form.toTime != null && form.assignTo != null ){

    if(new Date(form.fromDateOg).toLocaleDateString() >= new Date().toLocaleDateString()){ //Check if date entered is before todays date
      if(form.fromDate <= form.toDate){ //Check if from date is lesss than to date

        if(this.checkForHistoricTime(form.fromDateOg , form.fromTimeOg)){// Time should not be historic 

          if(new Date(form.fromTimeOg) < new Date(form.toTimeOg)){// From before to time


            if( (new Date(form.fromTimeOg) > this.workHourStartTime) && (new Date(form.fromTimeOg) < this.workHoursEndTime) 
            && (new Date(form.toTimeOg) > this.workHourStartTime) && (new Date(form.toTimeOg) < this.workHoursEndTime)
            ){ // Time should be within working hours

              if(this.checkIftaskAlreadyexist(this.toYYYYMMDD(new Date(form.fromDateOg)), this.toYYYYMMDD(new Date(form.toDateOg)) , form.fromTimeOg, form.toTimeOg , form.assignTo)){
                alert('Employee already have task in the selected dates and Time.');
                this.taskForm.reset();
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
            alert('Time Should be within working hours i.e 10:00 AM to 7:00 PM');
            }


          }
          else{
            alert('fromTime should be before toTime');
          }


        }
        else{
          alert('fromTime is a historic time now.');
        }

      }
      else {
        alert('fromDate should be less thatn toDate');
      }
  }
  else {
    alert('You cannot create a task for historical date');
  }



}
else{
  alert('All Fields are mandatory !');
}

    

  }


toYYYYMMDD(d) {
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 101).toString().slice(-2);
    var dd = (d.getDate() + 100).toString().slice(-2);
    return dd +'/'+ mm +'/'+yyyy;
}

calcTaskHours(toDate, fromDate){
  var x = (toDate-fromDate)/1000;
  x/=(60*60);
  return x;
}


  // Returns an array of dates between the two dates
getDates(startDate, endDate) {
  startDate = new Date (startDate);
  endDate = new Date (endDate);
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
