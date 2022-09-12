import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective {
  constructor(private element: ElementRef<HTMLInputElement>) { }

  ngAfterViewInit(): void {
    this.element.nativeElement.focus();
  }
}
