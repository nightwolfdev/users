import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Division, DivisionsService } from '../shared/services/divisions.service';
import { Title, TitlesService } from '../shared/services/titles.service';
import { UserData, UserFilterForm, UsersService } from '../shared/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  divisions$: Observable<Division[]>;
  errorLoadingMsg: string | null;
  form: FormGroup<UserFilterForm>;
  titles$: Observable<Title[]>;
  users$: Observable<UserData[]>;

  constructor(
    private divisionsSvc: DivisionsService,
    private router: Router,
    private titlesSvc: TitlesService,
    private usersSvc: UsersService
  ) { }

  private buildForm(): void {
    this.form = new FormGroup<UserFilterForm>({
      divisionId: new FormControl(0),
      name: new FormControl(''),
      titleId: new FormControl(0),
    });
  }

  ngOnInit(): void {
    this.buildForm();

    this.errorLoadingMsg = null;

    this.divisions$ = this.divisionsSvc.activeDivisions$;

    this.titles$ = this.titlesSvc.activeTitles$;

    this.users$ = combineLatest([
      this.divisionsSvc.allDivisions$,
      this.titlesSvc.allTitles$,
      this.usersSvc.allUsers$
    ]).pipe(
      map(([divisions, titles, users]) => users.map(user => ({
        ...user,
        division: divisions.find(division => division.id === user.divisionId)?.name,
        title: titles.find(title => title.id === user.titleId)?.name
      })) as UserData[]),
      catchError(response => {
        this.errorLoadingMsg = response.error.error;
        return throwError(() => new Error(response));
      })
    );
  }

  addUser(): void {
    this.router.navigateByUrl('/users/new');
  }

  onFilter(): void {
    const data = this.form.value;

    const filterCriteria = {
      divisionId: +data.divisionId!,
      name: data.name,
      titleId: +data.titleId!
    };

    this.usersSvc.changeFilter(filterCriteria);
  }
}
