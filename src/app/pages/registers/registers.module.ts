import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersRoutingModule } from './registers-routing.module';
import { RegistersComponent } from './registers/registers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterEditComponent } from './register-edit/register-edit.component';
import { AppBootstrapModule } from 'src/app/app-bootstrap.module';



@NgModule({
  declarations: [
    RegistersComponent,
    RegisterEditComponent
  ],
  imports: [
    CommonModule,
    RegistersRoutingModule,
    AppBootstrapModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegistersModule { }
