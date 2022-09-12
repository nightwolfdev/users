import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

import { combineLatest, BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export interface User {
  divisionId: number;
  email: string;
  firstName: string;
  id?: number;
  lastName: string;
  phone: string;
  titleId: number;
}

export interface UserData extends User {
  division: string;
  title: string;
}

export interface UserForm {
  divisionId: FormControl<number | null>;
  email: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  phone: FormControl<string | null>;
  titleId: FormControl<number | null>;
}

export interface UserFilterForm {
  divisionId: FormControl<number | null>;
  name: FormControl<string | null>;
  titleId: FormControl<number | null>;
}

interface FilterCriteria {
  divisionId?: number | null;
  name?: string | null;
  titleId?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly _filterCriteria = new BehaviorSubject<FilterCriteria | null>(null);
  private readonly _users = new BehaviorSubject<User[]>([]);

  readonly allUsers$ = this.getUsersByFilter();

  constructor(private http: HttpClient) {
    this.getUsers().subscribe();
  }

  private getCurrentUsers(): User[] {
    return this._users.getValue();
  }

  private getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiServer}/users`).pipe(
      tap(users => this._users.next(users.sort(this.sortUsers))),
      catchError(response => {
        this._users.error(response);
        return throwError(() => new Error(response));
      })
    );
  }

  private getUsersByFilter(): Observable<User[]> {
    return combineLatest([
      this._users.asObservable(),
      this._filterCriteria.asObservable()
    ]).pipe(
      map(([users, filterCriteria]) => {
        if (users && filterCriteria) {
          return users
            .filter(user => filterCriteria.name ? `${user.firstName} ${user.lastName}`.toLowerCase().includes(filterCriteria.name.toLowerCase()) : user)
            .filter(user => filterCriteria.divisionId ? user.divisionId === filterCriteria.divisionId : user)
            .filter(user => filterCriteria.titleId ? user.titleId === filterCriteria.titleId : user);
        }

        return users;
      })
    );
  }

  private sortUsers(a: User, b: User): number {
    const aName = `${a.lastName}, ${a.firstName}`.toUpperCase();
    const bName = `${b.lastName}, ${b.firstName}`.toUpperCase();

    if (aName < bName) {
      return -1;
    }

    if (aName > bName) {
      return 1;
    }

    return 0;
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiServer}/users`, user).pipe(
      tap(user => {
        const users = [...this.getCurrentUsers()];

        users.push(user);

        this._users.next(users.sort(this.sortUsers));
      })
    );
  }

  changeFilter(filterCriteria: FilterCriteria): void {
    this._filterCriteria.next(filterCriteria);
  }

  editUser(id: number, user: User): Observable<User> {
    return this.http.patch<User>(`${environment.apiServer}/users/${id}`, user).pipe(
      tap(updatedFields => {
        const users = [...this.getCurrentUsers()];
        const updatedUserIndex = users.findIndex(user => user.id === id);

        if (updatedUserIndex !== -1) {
          users[updatedUserIndex] = { ...users[updatedUserIndex], ...updatedFields };

          this._users.next(users.sort(this.sortUsers));
        }
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiServer}/users/${id}`);
  }

  removeUser(id: number): Observable<{ id: number }> {
    return this.http.delete<{ id: number }>(`${environment.apiServer}/users/${id}`).pipe(
      tap(() => {
        const currentUsers = [...this.getCurrentUsers()];
        const newUsers = currentUsers.filter(user => user.id !== id);

        this._users.next(newUsers);
      })
    );
  }
}
