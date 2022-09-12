import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'divisions',
    loadChildren: () => import('./divisions/divisions.module').then(m => m.DivisionsModule),
    title: 'Divisions'
  },
  {
    path: 'titles',
    loadChildren: () => import('./titles/titles.module').then(m => m.TitlesModule),
    title: 'Titles'
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    title: 'Users'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users'
  },
  {
    path: '*',
    redirectTo: 'users'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
