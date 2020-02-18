import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  // {
  //   path: 'schedule',
  //   loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  // },
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  // {
  //   path: 'type',
  //   loadChildren: () => import('./type/type.module').then( m => m.TypePageModule)
  // },
  // {
  //   path: 'time-table',
  //   loadChildren: () => import('./time-table/time-table.module').then( m => m.TimeTablePageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
