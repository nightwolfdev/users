import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DivisionsService } from '../../shared/services/divisions.service';
import { TitlesService } from '../../shared/services/titles.service';
import { UserData, UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  errorLoadingMsg: string | null;
  user$: Observable<UserData>;

  constructor(
    private divisionsSvc: DivisionsService,
    private route: ActivatedRoute,
    private router: Router,
    private titlesSvc: TitlesService,
    private usersSvc: UsersService
  ) { }

  ngOnInit(): void {
    this.user$ = combineLatest([
      this.divisionsSvc.allDivisions$,
      this.titlesSvc.allTitles$,
      this.route.paramMap.pipe(switchMap(params => this.usersSvc.getUser(+params.get('id')!)))
    ]).pipe(
      map(([divisions, titles, user]) => ({
        ...user,
        division: divisions.find(division => division.id === user.divisionId)?.name,
        title: titles.find(title => title.id === user.titleId)?.name
      }) as UserData),
      catchError(response => {
        this.errorLoadingMsg = response.error.error;
        return throwError(() => new Error(response));
      })
    )
  }

  editUser(id: number): void {
    this.router.navigate(['/users', id, 'edit']);
  }
}
