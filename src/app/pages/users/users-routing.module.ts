import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDetailComponent } from './user-detail/user-detail.component';



const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'edit/:userId', component: UserEditComponent, data: { child: true } },
  { path: 'detail/:userId', component: UserDetailComponent, data: { child: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
