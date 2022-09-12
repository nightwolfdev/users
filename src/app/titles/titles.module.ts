import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { TitlesRoutingModule } from './titles-routing.module';
import { TitlesComponent } from './titles.component';
import { TitleFormComponent } from './title-form/title-form.component';

import { AutofocusDirectiveModule } from '../shared/directives/autofocus/autofocus.directive.module';


@NgModule({
  declarations: [
    TitlesComponent,
    TitleFormComponent
  ],
  imports: [
    AutofocusDirectiveModule,
    ClarityModule,
    CommonModule,
    ReactiveFormsModule,
    TitlesRoutingModule
  ]
})
export class TitlesModule { }
