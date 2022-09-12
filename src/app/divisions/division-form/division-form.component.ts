import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrLoadingState } from '@clr/angular';

import { EMPTY, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Division, DivisionForm, DivisionsService } from '../../shared/services/divisions.service';

@Component({
  selector: 'app-division-form',
  templateUrl: './division-form.component.html',
  styleUrls: ['./division-form.component.scss']
})
export class DivisionFormComponent implements OnDestroy, OnInit {
  private subscriptions = new Subscription();

  divisionId: number | null;
  errorMsg: string | null;
  form: FormGroup<DivisionForm>;
  submitBtnState: ClrLoadingState;

  constructor(
    private divisionsSvc: DivisionsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  private addDivision(division: Division): void {
    const subscription = this.divisionsSvc.addDivision(division).subscribe({
      complete: () => {
        this.updateSubmitBtnState('DEFAULT');
        this.form.reset();
        this.form.patchValue({
          active: 1
        });
      },
      error: response => {
        this.errorMsg = response.error.error;
        this.updateSubmitBtnState('DEFAULT');
      }
    });

    this.subscriptions.add(subscription);
  }

  private buildForm(): void {
    this.form = new FormGroup<DivisionForm>({
      name: new FormControl('', Validators.required),
      active: new FormControl(1, Validators.required)
    });
  }

  private editDivision(division: Division): void {
    const subscription = this.divisionsSvc.editDivision(this.divisionId!, division).subscribe({
      complete: () => {
        this.router.navigateByUrl('/divisions');
      },
      error: response => {
        this.errorMsg = response.error.error;
        this.updateSubmitBtnState('DEFAULT');
      }
    });

    this.subscriptions.add(subscription);
  }

  private updateSubmitBtnState(state: 'DEFAULT' | 'LOADING'): void {
    this.submitBtnState = ClrLoadingState[state];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.buildForm();

    const subscription = this.route.paramMap.pipe(
      switchMap(params => {
        this.divisionId = params.get('id') !== 'new'
          ? +params.get('id')!
          : null;

        return this.divisionId 
          ? this.divisionsSvc.getDivision(this.divisionId)
          : EMPTY;
      }),
      tap(division => this.form.patchValue(division))
    ).subscribe();

    this.subscriptions.add(subscription);
  }

  onSubmit(): void {
    const data = this.form.value;

    const division = {
      name: data.name!,
      active: +data.active!
    }

    this.errorMsg = null;

    this.updateSubmitBtnState('LOADING');

    this.divisionId ? this.editDivision(division) : this.addDivision(division);
  }
}
