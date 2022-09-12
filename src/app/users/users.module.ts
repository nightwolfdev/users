import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ViewUserComponent } from './view-user/view-user.component';

import { AutofocusDirectiveModule } from '../shared/directives/autofocus/autofocus.directive.module';


@NgModule({
  declarations: [
    UsersComponent,
    UserFormComponent,
    ViewUserComponent
  ],
  imports: [
    AutofocusDirectiveModule,
    ClarityModule,
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
