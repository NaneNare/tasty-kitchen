import { AFUnwrappedDataSnapshot } from 'angularfire2/interfaces';
import {
    Component,
    Output,
    ViewChild,
    EventEmitter
} from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import * as moment from 'moment';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModelService } from "app/model.service";

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent {

    @Output() onDialogDismissEvent = new EventEmitter();

    private title: string;
    private dialogMessage: string;
    private dengerStylesEnabled: boolean = false;

    private records: FirebaseListObservable<any[]>;

    @ViewChild('alertDialogId') private modal: ModalComponent;

    constructor(public af: AngularFire, private db: AngularFireDatabase, private modelService: ModelService) {
    }

    public show(message: string, dengerMode: boolean = false, title: string = '') {
        this.title = !title && dengerMode ? 'Error Message' : title;
        this.dialogMessage = message;
        this.dengerStylesEnabled = dengerMode;

        this.modal.open();
        // TODO: The issue comes from the modal's lib.
        // This workaround used to change backdrop z-index as there is no way
        // to add custtom style / id to backdrop object for now.
        let backdrops = document.getElementsByClassName('modal-backdrop');
        if (backdrops.length > 1) {
            let backdrop = <HTMLElement>document.getElementsByClassName('modal-backdrop')[1];
            backdrop.style.zIndex = '1150';
        }
    }

    public hide() {
        this.modal.close();
    }

    public isVisible() {
        return this.modal.visible;
    }

    // private removeParticipantFrom(root: firebase.database.DataSnapshot,
    //     jsonKey: string,
    //     uuid: string,
    //     date: string) {
    //     var jsonPath = 'records/' + date + jsonKey;
    //     var jsonArr = root.child(jsonPath).val();
    //     if (null == jsonArr) return;
    //     console.log('============== jsonPath ' + jsonPath);
    //     console.log('============== jsonArr ' + jsonArr);
    //     jsonArr = this.remove(jsonArr, uuid);
    //     root.child(jsonPath).ref.set(jsonArr);
    // }

    // private addParticipantTO(root: firebase.database.DataSnapshot,
    //     jsonKey: string,
    //     uuid: string,
    //     date: string) {
    //     var jsonArr = [];
    //     var jsonPath = 'records/' + date + jsonKey;
    //     if (!root.hasChild(jsonPath)) {
    //         jsonArr.push(uuid);
    //         root.child(jsonPath).ref.set(jsonArr);
    //         return;
    //     }
    //     console.log('=======addParticipantTO======= jsonPath ' + jsonPath);
    //     jsonArr = root.child(jsonPath).val();
    //     if (!this.isContain(jsonArr, uuid)) {
    //         jsonArr.push(uuid);
    //         console.log('=======addParticipantTO======= jsonArr ' + jsonArr);
    //         root.child(jsonPath).ref.set(jsonArr);
    //     }
    // }

    private onNoPressed() {
        this.hide();
        var self = this;
        var m = moment();
        var today = m.format('YYYY-MM-DD');
        var uuid = this.af.auth.getAuth().uid;
        this.modelService.addParticipantInto('/participants', '/no-participants/', uuid, today);
        // db.$ref.once("value", function (s) {
        //     console.log("--- once remove " + s.hasChild('records'));
        //     console.log("--- once " + today + "  " + s.hasChild('records/' + today));
        //     self.removeParticipantFrom(s, '/participants/', uuid, today);
        //     self.addParticipantTO(s, '/no-participants/', uuid, today);
        //     console.log("--- onNoPressed " + uuid);
        // })
    }

    private onYesPressed() {
        this.hide();
        // this.records = this.db.list('records');
        var self = this;
        var m = moment();
        var today = m.format('YYYY-MM-DD');
        var uuid = this.af.auth.getAuth().uid;
        this.modelService.addParticipantInto('/no-participants', '/participants/', uuid, today);
        // db.$ref.once("value", function (s) {
        //     console.log("--- once records " + s.hasChild('records'));
        //     console.log("--- once " + today + "  " + s.hasChild('records/' + today));
        //     self.removeParticipantFrom(s, '/no-participants/', uuid, today);
        //     self.addParticipantTO(s, '/participants/', uuid, today);
        //     console.log("--- onYesPressed " + uuid);
        // })
    }

    private onDialogDismiss() {
        this.onDialogDismissEvent.emit();
    }

    // private remove = function (array: string[], value: string) {
    //     var resultArr = [];
    //     array.forEach(function (entry) {
    //         if (entry == value) return;
    //         resultArr.push(entry);
    //     });
    //     return resultArr;
    // }


    // private isContain = function (array: string[], value: string) {
    //     var exist = false;
    //     array.forEach(function (entry) {
    //         if (entry == value)
    //             exist = true;
    //     });
    //     return exist;
    // }
}