import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[raaFocusInvalidElement]' })
export class RaaFocusInvalidElementDirective {
  constructor(private element: ElementRef<HTMLElement>) {}

  setFocusToInvalidElement() {
    const firstInvalidElement: HTMLElement | null = this.element.nativeElement.querySelector('.ng-invalid');
    if (firstInvalidElement) {
      firstInvalidElement.focus();
    }
  }
}
