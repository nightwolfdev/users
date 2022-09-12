import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Division, DivisionsService } from '../shared/services/divisions.service';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit {
  errorLoadingMsg: string | null;
  divisions$: Observable<Division[]>;

  constructor(
    private divisionsSvc: DivisionsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.errorLoadingMsg = null;

    this.divisions$ = this.divisionsSvc.allDivisions$.pipe(
      catchError(response => {
        this.errorLoadingMsg = response.error.error;
        return throwError(() => new Error(response));
      })
    );
  }

  addDivision(): void {
    this.router.navigateByUrl('/divisions/new');
  }
}
