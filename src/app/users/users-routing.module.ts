import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserFormComponent } from './user-form/user-form.component';
import { UsersComponent } from './users.component';
import { ViewUserComponent } from './view-user/view-user.component';

const routes: Routes = [
  {
    path: ':id/edit',
    component: UserFormComponent,
    title: 'Edit User'
  },
  {
    path: ':id/view',
    component: ViewUserComponent,
    title: 'View User'
  },
  {
    path: 'new',
    component: UserFormComponent,
    title: 'Add User'
  },
  {
    path: '',
    component: UsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
