import { Component, OnInit } from '@angular/core';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  public usrType: any;
  constructor(
    public storage: Storage,
  ) {
   }

  ngOnInit() {
    this.storage.get('userType').then((result) => {
      console.log('User Type: ', result);
      this.usrType = result;
    });

  }

}
