import { Directive, AfterViewInit, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

const TAB_KEY_CODE = 9;

/**
 * Directive that isolates focus within an element. Set the class "initialFocus" on the element you want to be focused first (if you need to
 * have multiple possibie elements, the first element with the class will be focused).
 */
@Directive({
  selector: '[raaTrapFocus]'
})
export class RaaTrapFocusDirective implements AfterViewInit, OnChanges {

  @Input('raaTrapFocus')
  initialFocusElement: ElementRef;

  constructor(
    private element: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialFocusElement'] && changes['initialFocusElement'].currentValue) {
      changes['initialFocusElement'].currentValue.nativeElement.focus();
    }
  }

  ngAfterViewInit() {

    let tabbableElements = Array.prototype.slice.call(this.element.nativeElement.querySelectorAll('select, input, textarea, button, a'))
        .filter((el: HTMLElement) => !el.hidden);

    if (tabbableElements && tabbableElements.length) {

      let first = tabbableElements[0];
      let last = tabbableElements[tabbableElements.length - 1];

      let elementToFocus = (this.initialFocusElement && this.initialFocusElement.nativeElement) ? this.initialFocusElement.nativeElement : tabbableElements[0];

      if (elementToFocus && elementToFocus.focus) {
        elementToFocus.focus();
      }

      last.addEventListener('keydown', function (e: KeyboardEvent) {
          if ((e.which === TAB_KEY_CODE && !e.shiftKey)) {
              e.preventDefault();
              first.focus();
          }
      });

      first.addEventListener('keydown', function (e: KeyboardEvent) {
          if ((e.which === TAB_KEY_CODE && e.shiftKey)) {
              e.preventDefault();
              last.focus();
          }
      });
    }
  }
}