// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


// Users Routing
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './volunteers/users.component';
import { AdminsComponent } from './admins/admins.component';
import { BeneficiariesComponent } from './beneficiaries/beneficiaries.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule
  ],
  declarations: [
    UsersComponent,
    AdminsComponent,
    BeneficiariesComponent
  ]
})
export class UsersModule { }
