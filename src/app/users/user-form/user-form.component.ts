import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrLoadingState } from '@clr/angular';

import { EMPTY, Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Division, DivisionsService } from 'src/app/shared/services/divisions.service';
import { Title, TitlesService } from 'src/app/shared/services/titles.service';
import { User, UserForm, UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnDestroy, OnInit {
  private subscriptions = new Subscription();

  divisions$: Observable<Division[]>;
  errorLoadingMsg: string | null;
  errorRemovingMsg: string | null;
  form: FormGroup<UserForm>;
  modalOpen = false;
  removeBtnState: ClrLoadingState;
  submitBtnState: ClrLoadingState;
  titles$: Observable<Title[]>;
  userId: number | null;

  constructor(
    private divisionsSvc: DivisionsService,
    private route: ActivatedRoute,
    private router: Router,
    private titlesSvc: TitlesService,
    private usersSvc: UsersService
  ) { }

  private addUser(user: User): void {
    const subscription = this.usersSvc.addUser(user).subscribe({
      complete: () => {
        this.updateSubmitBtnState('DEFAULT');
        this.form.reset();
        this.form.patchValue({
          divisionId: 0,
          titleId: 0
        });
      },
      error: response => {
        this.errorLoadingMsg = response.error.error;
        this.updateSubmitBtnState('DEFAULT');
      }
    });

    this.subscriptions.add(subscription);
  }

  private buildForm(): void {
    this.form = new FormGroup<UserForm>({
      divisionId: new FormControl(0, [Validators.min(1), Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.minLength(10), Validators.maxLength(10), Validators.required]),
      titleId: new FormControl(0, [Validators.min(1), Validators.required]),
    });
  }

  private editUser(user: User): void {
    const subscription = this.usersSvc.editUser(this.userId!, user).subscribe({
      complete: () => {
        this.router.navigateByUrl('/users');
      },
      error: response => {
        this.errorLoadingMsg = response.error.error;
        this.updateSubmitBtnState('DEFAULT');
      }
    });

    this.subscriptions.add(subscription);
  }

  private updateRemoveBtnState(state: 'DEFAULT' | 'LOADING'): void {
    this.removeBtnState = ClrLoadingState[state];
  }

  private updateSubmitBtnState(state: 'DEFAULT' | 'LOADING'): void {
    this.submitBtnState = ClrLoadingState[state];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.buildForm();

    this.divisions$ = this.divisionsSvc.activeDivisions$;
    this.titles$ = this.titlesSvc.allTitles$;

    const subscription = this.route.paramMap.pipe(
      switchMap(params => {
        this.userId = params.get('id') !== 'new'
          ? +params.get('id')!
          : null;

        return this.userId 
          ? this.usersSvc.getUser(this.userId)
          : EMPTY;
      }),
      tap(user => this.form.patchValue(user))
    ).subscribe();

    this.subscriptions.add(subscription);
  }

  confirmRemoval(): void {
    this.errorRemovingMsg = null;
    this.modalOpen = true;
  }

  onRemove(): void {
    this.errorRemovingMsg = null;
    this.updateRemoveBtnState('LOADING');

    const subscription = this.usersSvc.removeUser(this.userId!).subscribe({
      complete: () => {
        this.router.navigateByUrl('/users');
      },
      error: response => {
        this.errorRemovingMsg = response.error.error;
        this.updateRemoveBtnState('DEFAULT');
      }
    });

    this.subscriptions.add(subscription);
  }

  onSubmit(): void {
    const data = this.form.value;

    const user = {
      divisionId: +data.divisionId!,
      email: data.email!,
      firstName: data.firstName!,
      lastName: data.lastName!,
      phone: data.phone!,
      titleId: +data.titleId!
    }

    this.errorLoadingMsg = null;

    this.updateSubmitBtnState('LOADING');

    this.userId ? this.editUser(user) : this.addUser(user);
  }
}
