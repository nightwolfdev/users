import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export interface Division {
  id?: number;
  name: string;
  active: number;
}

export interface DivisionForm {
  name: FormControl<string | null>;
  active: FormControl<number | null>;
}

@Injectable({
  providedIn: 'root'
})
export class DivisionsService {
  private readonly _divisions = new BehaviorSubject<Division[]>([]);

  readonly activeDivisions$ = this._divisions.asObservable().pipe(
    map(divisions => divisions.filter(division => division.active))
  );

  readonly allDivisions$ = this._divisions.asObservable();

  constructor(private http: HttpClient) {
    this.getDivisions().subscribe();
  }

  private getCurrentDivisions(): Division[] {
    return this._divisions.getValue();
  }

  private getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(`${environment.apiServer}/divisions`).pipe(
      tap(divisions => this._divisions.next(divisions.sort(this.sortDivisions))),
      catchError(response => {
        this._divisions.error(response);
        return throwError(() => new Error(response));
      })
    );
  }

  private sortDivisions(a: Division, b: Division): number {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  }

  addDivision(division: Division): Observable<Division> {
    return this.http.post<Division>(`${environment.apiServer}/divisions`, division).pipe(
      tap(division => {
        const divisions = [...this.getCurrentDivisions()];

        divisions.push(division);

        this._divisions.next(divisions.sort(this.sortDivisions));
      })
    );
  }

  editDivision(id: number, division: Division): Observable<Division> {
    return this.http.patch<Division>(`${environment.apiServer}/divisions/${id}`, division).pipe(
      tap(updatedFields => {
        const divisions = [...this.getCurrentDivisions()];
        const updatedDivisionIndex = divisions.findIndex(division => division.id === id);

        if (updatedDivisionIndex !== -1) {
          divisions[updatedDivisionIndex] = { ...divisions[updatedDivisionIndex], ...updatedFields };

          this._divisions.next(divisions.sort(this.sortDivisions));
        }
      })
    );
  }

  getDivision(id: number): Observable<Division> {
    return this.http.get<Division>(`${environment.apiServer}/divisions/${id}`);
  }
}
