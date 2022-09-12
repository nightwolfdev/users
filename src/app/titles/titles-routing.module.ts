import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TitleFormComponent } from './title-form/title-form.component';
import { TitlesComponent } from './titles.component';

const routes: Routes = [
  {
    path: ':id/edit',
    component: TitleFormComponent,
    title: 'Edit Title'
  },
  {
    path: 'new',
    component: TitleFormComponent,
    title: 'Add Title'
  },
  {
    path: '',
    component: TitlesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TitlesRoutingModule { }
