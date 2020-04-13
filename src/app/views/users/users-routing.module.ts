import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './volunteers/users.component';
import { AdminsComponent } from './admins/admins.component';

const routes: Routes = [
  { path: '', data: { title: 'Usuarios' },
    children: [
      { path: '', redirectTo: 'volunteers' },
      { path: 'volunteers', component: UsersComponent, data: { title: 'Voluntarios' } },
      { path: 'admins', component: AdminsComponent, data: { title: 'Administradores' } },
      { path: 'beneficiaries', component: AdminsComponent, data: { title: 'Beneficiarios' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
