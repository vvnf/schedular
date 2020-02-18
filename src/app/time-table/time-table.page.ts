import { Component, OnInit, ViewChild } from '@angular/core';
import { CloudStoreService } from '../services/cloud-store.service';
import { Subscription } from 'rxjs';
import {Storage} from '@ionic/storage';
import { Chart } from 'chart.js';

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

  calendar = {
    mode:'week',
    currentDate: new Date(),
  }


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
  onEventSelected(){

  }

  onViewTitleChanged(){

  }

  onTimeSelected(){

  }

  constructor(
    private cloudStore: CloudStoreService,
    public storage: Storage,
  ) { }

  ngOnInit() {

    this.storage.get('user').then((user) => {
      console.log('USER :', user);
      this.loggedinUser= user;
      this.tasksSubscriber = this.cloudStore.getTasksAssignedTome(this.loggedinUser).subscribe(data=>{
        this.tasks = data.map(e => {
          console.log('ttttasl: ',e.payload.doc.data());
          return {
            id: e.payload.doc.id,
            title:e.payload.doc.data()['title'],
            desc:e.payload.doc.data()['description'],
            startTime: new Date (e.payload.doc.data()['fromDate']),
            endTime : new Date (e.payload.doc.data()['toDate']),
            allDay: true,
            //tasksDates: this.getDates(new Date(e.payload.doc.data()['fromDate']), new Date(e.payload.doc.data()['toDate'])),
          };
      });
      for(let i=0;i<this.tasks.length;i++){
        console.log('tasks: ',this.tasks[i]);
          this.eventSource.push(this.tasks[i]);
      }
      });
      console.log('TAKS :', this.tasks);
      

    });
    

  }

}
