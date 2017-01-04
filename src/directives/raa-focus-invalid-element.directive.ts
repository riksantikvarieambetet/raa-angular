import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[raaFocusInvalidElement]' })
export class RaaFocusInvalidElementDirective {

    constructor(
        private element: ElementRef,
    ) {}

    setFocusToInvalidElement() {
        let firstInvalidInput = this.element.nativeElement.querySelector('.ng-invalid');
        if (firstInvalidInput) {
             firstInvalidInput.focus();
        }
    }

}