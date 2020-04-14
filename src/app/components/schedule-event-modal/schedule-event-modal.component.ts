import { Component, OnInit, Input } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct, NgbActiveModal, NgbCalendar, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schedule-event-modal',
  templateUrl: './schedule-event-modal.component.html',
  styleUrls: ['./schedule-event-modal.component.css']
})
export class ScheduleEventModalComponent implements OnInit {

  @Input() title = 'Fecha y hora para el evento';
  @Input() btnLabelAccept = 'Crear';
  @Input() minutes = 50;

  public scheduleDate: NgbDateStruct;
  public scheduleTimeIni: NgbTimeStruct;
  public scheduleTimeFin: NgbTimeStruct;
  public scheduleTimeMeridian: boolean;
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
      const today1h = moment().tz('America/Mexico_City').add(1, 'hours');
      this.scheduleDate = this.calendar.getToday();
      this.scheduleTimeIni = { hour: today.hour(), minute: 0, second: 0 };
      this.scheduleTimeFin = { hour: today1h.hour(), minute: 0, second: 0 };
    }


  closeModal() {
    this.activeModal.dismiss();
  }

  toggleMeridian() {
    this.scheduleTimeMeridian = !this.scheduleTimeMeridian;
  }

  onScheduleEvent() {
    let eventDate = null;
    let eventDateFinal = null;
    const today = moment().tz('America/Mexico_City');
    let sScheduleDate = this.scheduleDate.year + '-';
    sScheduleDate += (this.scheduleDate.month >= 10 ? this.scheduleDate.month : '0' + this.scheduleDate.month) + '-';
    sScheduleDate += (this.scheduleDate.day >= 10 ? this.scheduleDate.day : '0' + this.scheduleDate.day);

    let sScheduleTimeIni = (this.scheduleTimeIni.hour >= 10 ? this.scheduleTimeIni.hour : '0' + this.scheduleTimeIni.hour) + ':';
    sScheduleTimeIni += (this.scheduleTimeIni.minute >= 10 ? this.scheduleTimeIni.minute : '0' + this.scheduleTimeIni.minute) + ':';
    sScheduleTimeIni += '00';

    let sScheduleTimeFin = (this.scheduleTimeFin.hour >= 10 ? this.scheduleTimeFin.hour : '0' + this.scheduleTimeFin.hour) + ':';
    sScheduleTimeFin += (this.scheduleTimeFin.minute >= 10 ? this.scheduleTimeFin.minute : '0' + this.scheduleTimeFin.minute) + ':';
    sScheduleTimeFin += '00';

    eventDate = moment(sScheduleDate + 'T' + sScheduleTimeIni).tz('America/Mexico_City');
    eventDateFinal = moment(sScheduleDate + 'T' + sScheduleTimeFin).tz('America/Mexico_City');

    let differentMinutes = 0;
    differentMinutes = eventDateFinal.diff(eventDate, 'minutes');
    // console.log("First", differentMinutes < parseInt(classCn.minutes, 10))
    if ( differentMinutes < this.minutes ) {
        Swal.fire({ 
          title: 'Error',
          html: 'El evento no puede ser creado con el horario o fecha establecido',
          type: 'error'
        });
        return ;
        // html: `Los ${differentMinutes} minutos (hora final - hora inicial) es menor a los ${this.minutes} minutos efectivos del evento`,
    }
    differentMinutes = eventDateFinal.diff(today, 'minutes');
    // console.log("Second", differentMinutes < parseInt(classCn.minutes, 10))
    if ( differentMinutes < this.minutes ) {
        Swal.fire({
          title: 'Error',
          html: 'El evento no puede ser creado con el horario o fecha establecido',
          type: 'error'
        });
        return ;
        // html: `La hora final y los ${this.minutes} minutos efectivos del evento no coinciden`,
    }

    const data = {
      eventDate: eventDate.format(),
      eventDateFinal: eventDateFinal.format()
    };

    this.activeModal.close(data);
  }


}
