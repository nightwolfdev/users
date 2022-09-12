import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DivisionFormComponent } from './division-form/division-form.component';
import { DivisionsComponent } from './divisions.component';

const routes: Routes = [
  {
    path: ':id/edit',
    component: DivisionFormComponent,
    title: 'Edit Division'
  },
  {
    path: 'new',
    component: DivisionFormComponent,
    title: 'Add Division'
  },
  {
    path: '',
    component: DivisionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionsRoutingModule { }
