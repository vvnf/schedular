import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexPage } from './index.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: IndexPage,
    children: [
      {
        path: 'home',//Home
        // loadChildren: '../home/home.module#HomePageModule'
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'schedule',//Schedule
        //loadChildren: '../schedule/schedule.module#SchedulePageModule'
        loadChildren: () => import('../schedule/schedule.module').then( m => m.SchedulePageModule)
      },
      {
        path: 'timeTable',//Schedule
        //loadChildren: '../time-table/time-table.module#TimeTablePageModule'
        loadChildren: () => import('../time-table/time-table.module').then( m => m.TimeTablePageModule)
      },
      // {
      //   path: 'register',//Schedule
      //   loadChildren: '../register/register.module#RegisterPageModule'
      // },
    ]
  },
  {
    path: '',//Dashboard
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexPageRoutingModule {}
