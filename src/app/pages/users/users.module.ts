import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { UsersRoutingModule } from './users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AppBootstrapModule } from 'src/app/app-bootstrap.module';
import { PaginatorComponent } from './users/paginator/paginator.component';



@NgModule({
  declarations: [
    UsersComponent,
    UserDetailComponent,
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppBootstrapModule
  ]
})
export class UsersModule { }
