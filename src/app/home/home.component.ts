import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFire, AuthProviders, AuthMethods, AngularFireDatabase } from 'angularfire2';

import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import * as moment from 'moment';
import { ModelService } from "app/model.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: { '[@moveIn]': '' }
})
export class HomeComponent {

  private name: any;
  private state: string = '';

  @ViewChild(AlertDialogComponent) private alertDialog: AlertDialogComponent;

  constructor(public af: AngularFire, private router: Router, private modelService: ModelService) { //, private db: AngularFireDatabase
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.name = auth;
      }
    });
  }

  logout() {
    this.af.auth.logout();
    console.log('logged out');
    this.router.navigateByUrl('/login');
  }

  private onPrimaryButtonClick() {
    // firebase.auth().
  }

  private onParticipateTodayButtonClick() {
    this.alertDialog.show('Are you going to paticipate today ?');
  }


  private onGetNotParticipantsForTodayButtonClick() {
    var m = moment();
    var today = m.format('YYYY-MM-DD');
    var result = this.modelService.getNotParticipantsForDate(today);
    console.log('>>>>>>> no participants for ' + today + ' is/are ' + result);
  }

  private onGetParticipantsCountForTodayButtonClick() {
    var m = moment();
    var today = m.format('YYYY-MM-DD');
    var result = this.modelService.getParticipantsCountForDate(today);
    console.log('>>>>>>> participants count for ' + today + ' is/are ' + result);
  }

  // private getNamesOfUsers(root: firebase.database.DataSnapshot, jsonArr: any[]) {
  //   var result = '';
  //   var self = this;
  //   jsonArr.forEach(function (uuid) {
  //     result += self.getNameByUUID(root, uuid);
  //   })
  //   return result;
  // }

  // private getNameByUUID(root: firebase.database.DataSnapshot, uuid: string) {
  //   var name = root.child('users/' + uuid + '/name').val();
  //   if (null == name) {
  //     return '';
  //   }
  //   return name + ',';
  // }

  // private getCount(array: string[]) {
  //   if (null != array) {
  //     return array.length;
  //   }
  //   return 0;
  // }
}
