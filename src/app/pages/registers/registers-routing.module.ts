import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistersComponent } from './registers/registers.component';
import { RegisterEditComponent } from './register-edit/register-edit.component';
import { RegisterDetailComponent } from './register-detail/register-detail.component';



const routes: Routes = [
  { path: '', component: RegistersComponent },
  { path: 'edit/:userId', component: RegisterEditComponent, data: { child: true } },
  { path: 'detail/:userId', component: RegisterDetailComponent, data: { child: true } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistersRoutingModule { }
