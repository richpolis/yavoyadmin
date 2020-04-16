import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistersComponent } from './registers/registers.component';
import { RegisterEditComponent } from './register-edit/register-edit.component';



const routes: Routes = [
  { path: '', component: RegistersComponent },
  { path: 'edit/:userId', component: RegisterEditComponent, data: { child: true } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistersRoutingModule { }
