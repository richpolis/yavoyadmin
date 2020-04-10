import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';

const routes: Routes = [
  { path: '', data: { title: 'Usuarios' },
    children: [
      { path: '', redirectTo: 'volunteers' },
      { path: 'volunteers', component: UsersComponent, data: { title: 'Voluntarios' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
