import { Component, OnInit, Input } from '@angular/core';
import { NgbTimeStruct, NgbActiveModal, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-timepicker-modal',
  templateUrl: './timepicker-modal.component.html',
  styleUrls: ['./timepicker-modal.component.css']
})
export class TimepickerModalComponent implements OnInit {

  @Input() hour = 0;
  @Input() minute = 0;
  @Input() title = 'Hora inicial';

  public valueTime: NgbTimeStruct;
  public valueMeridian: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private configTime: NgbTimepickerConfig) {
      this.configTime.spinners = true;
      this.configTime.seconds = false;
      this.configTime.minuteStep = 5;
      this.configTime.readonlyInputs = true;
     }

  ngOnInit() {
    this.valueMeridian = true;
    this.valueTime = { hour: this.hour, minute: this.minute, second: 0};
  }


  closeModal() {
    this.activeModal.dismiss();
  }

  toggleMeridian() {
    this.valueMeridian = !this.valueMeridian;
  }

  onSubmit() {
    let sValueTime = (this.valueTime.hour >= 10 ? this.valueTime.hour : '0' + this.valueTime.hour) + ':';
    sValueTime += (this.valueTime.minute >= 10 ? this.valueTime.minute : '0' + this.valueTime.minute) + ':';
    sValueTime += '00';
    this.activeModal.close(sValueTime);
  }


}
