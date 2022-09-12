import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Title, TitlesService } from '../shared/services/titles.service';

@Component({
  selector: 'app-titles',
  templateUrl: './titles.component.html',
  styleUrls: ['./titles.component.scss']
})
export class TitlesComponent implements OnInit {
  errorLoadingMsg: string | null;
  titles$: Observable<Title[]>;

  constructor(
    private titlesSvc: TitlesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.errorLoadingMsg = null;

    this.titles$ = this.titlesSvc.allTitles$.pipe(
      catchError(response => {
        this.errorLoadingMsg = response.error.error;
        return throwError(() => new Error(response));
      })
    );
  }

  addTitle(): void {
    this.router.navigateByUrl('/titles/new');
  }
}
