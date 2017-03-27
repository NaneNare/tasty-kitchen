import { Injectable } from '@angular/core';
import { ModelService } from "app/model.service";
import * as Cron from "node-cron";


@Injectable()
export class ScheduleService {

  constructor(private modelService: ModelService) {
    console.log('-----');
    Cron.schedule('10 10 * * *', function () {
      console.log('running a task at 10:10');
    });
  }

}
