import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  { path: 'users', loadChildren: './users/users.module#UsersModule' },
  { path: 'registers', loadChildren: './registers/registers.module#RegistersModule' },
  { path: '', redirectTo: '/dashboard/registers', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
