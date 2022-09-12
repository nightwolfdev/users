import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export interface Title {
  id?: number;
  name: string;
  active: number;
}

export interface TitleForm {
  name: FormControl<string | null>;
  active: FormControl<number | null>;
}

@Injectable({
  providedIn: 'root'
})
export class TitlesService {
  private readonly _titles= new BehaviorSubject<Title[]>([]);

  readonly activeTitles$ = this._titles.asObservable().pipe(
    map(titles => titles.filter(title => title.active))
  );

  readonly allTitles$ = this._titles.asObservable();

  constructor(private http: HttpClient) {
    this.getTitles().subscribe();
  }

  private getCurrentTitles(): Title[] {
    return this._titles.getValue();
  }

  private getTitles(): Observable<Title[]> {
    return this.http.get<Title[]>(`${environment.apiServer}/titles`).pipe(
      tap(titles => this._titles.next(titles.sort(this.sortTitles))),
      catchError(response => {
        this._titles.error(response);
        return throwError(() => new Error(response));
      })
    );
  }

  private sortTitles(a: Title, b: Title): number {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  }

  addTitle(title: Title): Observable<Title> {
    return this.http.post<Title>(`${environment.apiServer}/titles`, title).pipe(
      tap(title => {
        const titles = [...this.getCurrentTitles()];

        titles.push(title);

        this._titles.next(titles.sort(this.sortTitles));
      })
    );
  }

  editTitle(id: number, title: Title): Observable<Title> {
    return this.http.patch<Title>(`${environment.apiServer}/titles/${id}`, title).pipe(
      tap(updatedFields => {
        const titles = [...this.getCurrentTitles()];
        const updatedTitleIndex = titles.findIndex(title => title.id === id);

        if (updatedTitleIndex !== -1) {
          titles[updatedTitleIndex] = { ...titles[updatedTitleIndex], ...updatedFields };

          this._titles.next(titles.sort(this.sortTitles));
        }
      })
    );
  }

  getTitle(id: number): Observable<Title> {
    return this.http.get<Title>(`${environment.apiServer}/titles/${id}`);
  }
}
