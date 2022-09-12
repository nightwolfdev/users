import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrLoadingState } from '@clr/angular';

import { EMPTY, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Title, TitleForm, TitlesService } from '../../shared/services/titles.service';

@Component({
  selector: 'app-title-form',
  templateUrl: './title-form.component.html',
  styleUrls: ['./title-form.component.scss']
})
export class TitleFormComponent implements OnDestroy, OnInit {
  private subscriptions = new Subscription();

  errorMsg: string | null;
  form: FormGroup<TitleForm>;
  submitBtnState: ClrLoadingState;
  titleId: number | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titlesSvc: TitlesService
  ) { }

  private addTitle(title: Title): void {
    const subscription = this.titlesSvc.addTitle(title).subscribe({
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
    this.form = new FormGroup<TitleForm>({
      name: new FormControl('', Validators.required),
      active: new FormControl(1, Validators.required)
    });
  }

  private editTitle(title: Title): void {
    const subscription = this.titlesSvc.editTitle(this.titleId!, title).subscribe({
      complete: () => {
        this.router.navigateByUrl('/titles');
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
        this.titleId = params.get('id') !== 'new'
          ? +params.get('id')!
          : null;

        return this.titleId 
          ? this.titlesSvc.getTitle(this.titleId)
          : EMPTY;
      }),
      tap(title => this.form.patchValue(title))
    ).subscribe();

    this.subscriptions.add(subscription);
  }

  onSubmit(): void {
    const data = this.form.value;

    const title = {
      name: data.name!,
      active: +data.active!
    }

    this.errorMsg = null;

    this.updateSubmitBtnState('LOADING');

    this.titleId ? this.editTitle(title) : this.addTitle(title);
  }
}
