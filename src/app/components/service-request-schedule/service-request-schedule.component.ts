import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbCalendar, NgbTimeStruct, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-service-request-schedule',
  templateUrl: './service-request-schedule.component.html',
  styleUrls: ['./service-request-schedule.component.css']
})
export class ServiceRequestScheduleComponent implements OnInit {

  @Input() title = 'Fecha y hora para la cita';
  @Input() btnLabelAccept = 'Programar';
  @Input() reason = '';
  @Input() labelReason = 'Mensaje';
  @Input() showDateTime = true;

  public scheduleDate: NgbDateStruct;
  public scheduleTime: NgbTimeStruct;
  public scheduleTimeMeridian: boolean;
  private _scheduleAt = '';
  public messageReason = '';


  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private configTime: NgbTimepickerConfig) {
      this.configTime.spinners = true;
      this.configTime.seconds = false;
      this.configTime.minuteStep = 5;
      this.configTime.readonlyInputs = true;
     }

    ngOnInit() {
      this.scheduleTimeMeridian = true;
      const today = moment().tz('America/Mexico_City');
      this.scheduleDate = this.calendar.getToday();
      this.scheduleTime = { hour: today.hour(), minute: 0, second: 0 };
    }


  closeModal() {
    this.activeModal.dismiss();
  }

  toggleMeridian() {
    this.scheduleTimeMeridian = !this.scheduleTimeMeridian;
  }

  onScheduleServiceRequest() {
    let scheduleAt = null;
    if (this.showDateTime) {
      let sScheduleDate = this.scheduleDate.year + '-';
      sScheduleDate += (this.scheduleDate.month >= 10 ? this.scheduleDate.month : '0' + this.scheduleDate.month) + '-';
      sScheduleDate += (this.scheduleDate.day >= 10 ? this.scheduleDate.day : '0' + this.scheduleDate.day);

      let sScheduleTime = (this.scheduleTime.hour >= 10 ? this.scheduleTime.hour : '0' + this.scheduleTime.hour) + ':';
      sScheduleTime += (this.scheduleTime.minute >= 10 ? this.scheduleTime.minute : '0' + this.scheduleTime.minute) + ':';
      sScheduleTime += '00';

      scheduleAt = moment(sScheduleDate + 'T' + sScheduleTime).tz('America/Mexico_City');
    } else {
      scheduleAt = moment().tz('America/Mexico_City');
    }
    const data = {
      dateAt: scheduleAt.format(),
      reason: this.reason
    };

    this.activeModal.close(data);
  }


}
