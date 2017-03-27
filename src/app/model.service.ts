import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2";
import * as moment from 'moment';

@Injectable()
export class ModelService {

  private database: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) {
    //TODO: correct
    this.database = this.db.list('https://tasty-kitchen-7e6c3.firebaseio.com'); //TODO
  }

  public addParticipantInto(jsonKeyPrt1: string, jsonKeyPrt2: string, uuid: string, date: string) {
    console.log('--- addParticipantInto: uuid: ' + uuid
      + ' jsonKeyPrt1: ' + jsonKeyPrt1   //'/no-participants/' -- YES    '/participants/' -- NO
      + ' jsonKeyPrt2: ' + jsonKeyPrt2   //'/participants/'              '/no-participants/'
      + ' date: ' + date);
    var selfP = this;
    this.database.$ref.once('value', function (s) {
      console.log('--- once records ' + s.hasChild('records'));
      console.log('--- once ' + date + '  ' + s.hasChild('records/' + date));
      selfP.removeParticipantFrom(s, jsonKeyPrt1, uuid, date);
      selfP.addParticipantTO(s, jsonKeyPrt2, uuid, date);
      console.log('--- addParticipantInto end ' + uuid);
    })
  }

  private removeParticipantFrom(root: firebase.database.DataSnapshot,
    jsonKey: string,
    uuid: string,
    date: string) {
    var jsonPath = 'records/' + date + jsonKey;
    var jsonArr = root.child(jsonPath).val();
    if (null == jsonArr) return;
    console.log('============== jsonPath ' + jsonPath);
    console.log('============== jsonArr ' + jsonArr);
    jsonArr = this.remove(jsonArr, uuid);
    root.child(jsonPath).ref.set(jsonArr);
  }

  private addParticipantTO(root: firebase.database.DataSnapshot,
    jsonKey: string,
    uuid: string,
    date: string) {
    var jsonArr = [];
    var jsonPath = 'records/' + date + jsonKey;
    if (!root.hasChild(jsonPath)) {
      jsonArr.push(uuid);
      root.child(jsonPath).ref.set(jsonArr);
      return;
    }
    console.log('=======addParticipantTO======= jsonPath ' + jsonPath);
    jsonArr = root.child(jsonPath).val();
    if (!this.isContain(jsonArr, uuid)) {
      jsonArr.push(uuid);
      console.log('=======addParticipantTO======= jsonArr ' + jsonArr);
      root.child(jsonPath).ref.set(jsonArr);
    }
  }

  private getNamesOfUsers(root: firebase.database.DataSnapshot, jsonArr: any[]) {
    var result = '';
    var self = this;
    jsonArr.forEach(function (uuid) {
      result += self.getNameByUUID(root, uuid);
    })
    return result;
  }

  private getNameByUUID(root: firebase.database.DataSnapshot, uuid: string) {
    var name = root.child('users/' + uuid + '/name').val();
    if (null == name) {
      return '';
    }
    return name + ',';
  }

  private getCount(array: string[]) {
    if (null != array) {
      return array.length;
    }
    return 0;
  }

  private remove = function (array: string[], value: string) {
    var resultArr = [];
    array.forEach(function (entry) {
      if (entry == value) return;
      resultArr.push(entry);
    });
    return resultArr;
  }

  private isContain = function (array: string[], value: string) {
    var exist = false;
    array.forEach(function (entry) {
      if (entry == value)
        exist = true;
    });
    return exist;
  }

  public getNotParticipantsForDate(date: string) {
    console.log('--- getNotParticipantsForDate: '
      + ' date: ' + date);
    var self = this;
    var result = '';
    this.database.$ref.once('value', function (s) {
      console.log('--- once onGetNotParticipantsForTodayButtonClick ' + s.hasChild('records'));
      var jsonPath = 'records/' + date + '/no-participants/';
      var jsonArr = s.child(jsonPath).val();
      if (null != jsonArr) {
        result = self.getNamesOfUsers(s, jsonArr);
      } else {
        result = 'none';
      }
      console.log('>>>>>>> no participants for ' + date + ' is/are ' + result);
    })
    return result;
  }

  public getParticipantsCountForDate(date: string) {
    console.log('--- getParticipantsCountForDate: '
      + ' date: ' + date);
    var self = this;
    var result = 0;
    this.database.$ref.once('value', function (s) {
      console.log('--- once getParticipantsCountForDate ' + s.hasChild('records'));
      var jsonPath = 'records/' + date + '/participants/';
      var jsonArr = s.child(jsonPath).val();
      result = self.getCount(jsonArr);
      console.log('>>>>>>> participants count for ' + date + ' is/are ' + result);
    })
    return result;
  }

}
