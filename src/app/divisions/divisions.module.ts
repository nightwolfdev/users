import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { DivisionsRoutingModule } from './divisions-routing.module';
import { DivisionsComponent } from './divisions.component';
import { DivisionFormComponent } from './division-form/division-form.component';

import { AutofocusDirectiveModule } from '../shared/directives/autofocus/autofocus.directive.module';


@NgModule({
  declarations: [
    DivisionsComponent,
    DivisionFormComponent
  ],
  imports: [
    AutofocusDirectiveModule,
    ClarityModule,
    CommonModule,
    ReactiveFormsModule,
    DivisionsRoutingModule
  ]
})
export class DivisionsModule { }
