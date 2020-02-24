import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CloudStoreService } from '../services/cloud-store.service';
import { Subscription } from 'rxjs';
import {Storage} from '@ionic/storage';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import * as moment from 'moment';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.page.html',
  styleUrls: ['./time-table.page.scss'],
})
export class TimeTablePage implements OnInit {

  // @ViewChild('barChart') barChart;
  // @ViewChild('hrzBarChart') hrzBarChart;

  public loggedinUser:any;
  eventSource=[];
  public tasksSubscriber: Subscription;
  public tasks=[];
  public viewTitle;

  calendar = {
    mode:'month',
    currentDate: new Date(),
  }

  @ViewChild(CalendarComponent, {static: false}) myCal: CalendarComponent;


  // bars: any;
  // hrzBars: any;
  // colorArray: any;

  // ionViewDidEnter() {
  //   this.createBarChart();
  //   this.createHrzBarChart();
  // }

  // createBarChart() {
  //   this.bars = new Chart(this.barChart.nativeElement, {
  //     type: 'bar',
  //     data: {
  //       labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
  //       datasets: [{
  //         label: 'Viewers in millions',
  //         data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
  //         backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
  //         borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }]
  //       }
  //     }
  //   });
  // }

  // createHrzBarChart() {
  //   this.hrzBars = new Chart(this.hrzBarChart.nativeElement, {
  //     type: 'horizontalBar',
  //     data: {
  //       labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
  //       datasets: [{
  //         label: 'Viewers in millions',
  //         data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
  //         backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
  //         borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }]
  //       }
  //     }
  //   });
  // }
  onEventSelected(event){
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    alert(event.desc);
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(){

  }

  mergeDayandTime(day, time)
{
 let newDate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes(), 0, 0);
  return newDate;
}

// formatAMPM(date) {
//   var hours = date.getHours();
//   var minutes = date.getMinutes();
//   var ampm = hours >= 12 ? 'pm' : 'am';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0'+minutes : minutes;
//   var strTime = hours + ':' + minutes + ' ' + ampm;
//   return strTime;
// }

  constructor(
    private cloudStore: CloudStoreService,
    public storage: Storage,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {

    this.storage.get('user').then((user) => {
      console.log('USER :', user);
      this.loggedinUser= user;
      this.tasksSubscriber = this.cloudStore.getTasksAssignedTome(this.loggedinUser).subscribe(data=>{
        this.tasks = data.map(e => {
          //console.log('ttttasl: ',e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            title:e.payload.doc.data()['title'],
            desc:e.payload.doc.data()['description'],
            startDay: e.payload.doc.data()['fromDateOg'],
            endDay: e.payload.doc.data()['toDateOg'],
            startTime:e.payload.doc.data()['fromTimeOg'],
            endTime:e.payload.doc.data()['toTimeOg'],
            // startTime: ((new Date(e.payload.doc.data()['fromDateOg'])).setTime((new Date(e.payload.doc.data()['fromTimeOg'])).getTime())),
            // endTime : ((new Date(e.payload.doc.data()['toDateOg'])).setTime((new Date(e.payload.doc.data()['toTimeOg'])).getTime())),
            allDay: false,
            //tasksDates: this.getDates(new Date(e.payload.doc.data()['fromDate']), new Date(e.payload.doc.data()['toDate'])),
          };
      });
      for(let i=0;i<this.tasks.length;i++){
        console.log('tasks: ',this.tasks[i]);


        console.log('adsasas' , this.mergeDayandTime(  new Date(this.tasks[i].startDay), new Date(this.tasks[i].startTime)) );

        console.log('adsasas' , this.mergeDayandTime(  new Date(this.tasks[i].endDay), new Date(this.tasks[i].endTime)) );
        // let startTime = new Date(this.tasks[i].startDay);
        // startTime.setTime(new Date(this.tasks[i].startTime).getTime());
        this.tasks[i].startTime = this.mergeDayandTime(  new Date(this.tasks[i].startDay), new Date(this.tasks[i].startTime));


        // let endTime = new Date(this.tasks[i].endDay);
        // endTime.setTime(new Date(this.tasks[i].endTime).getTime());
        this.tasks[i].endTime = this.mergeDayandTime(  new Date(this.tasks[i].endDay), new Date(this.tasks[i].endTime));

        //console.log('asdasd' , this.tasks[i]);
          this.eventSource.push(this.tasks[i]);
          this.myCal.loadEvents();
      }
      });
      console.log('TAKS :', this.tasks);
      

    });
    

  }

}
