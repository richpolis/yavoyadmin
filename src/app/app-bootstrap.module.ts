import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbButtonsModule,
  NgbAlertModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPaginationModule,
  NgbPopoverModule,
  NgbTimepickerModule,
  NgbToastModule
} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbButtonsModule,
    NgbAlertModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbPaginationModule,
    NgbPopoverModule,
    NgbTimepickerModule,
    NgbToastModule
  ],
  exports: [
    NgbButtonsModule,
    NgbAlertModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbPaginationModule,
    NgbPopoverModule,
    NgbTimepickerModule,
    NgbToastModule
  ]
})
export class AppBootstrapModule { }
