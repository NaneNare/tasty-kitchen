import { Component } from '@angular/core';
import { ScheduleService } from "app/schedule.service";


// import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(service: ScheduleService) {

  }
}
