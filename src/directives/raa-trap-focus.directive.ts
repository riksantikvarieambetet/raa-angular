import { Directive, AfterViewInit, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

const TAB_KEY_CODE = 9;

/**
 * Directive that isolates focus within an element. Set the class "initialFocus" on the element you want to be focused first (if you need to
 * have multiple possibie elements, the first element with the class will be focused).
 */
@Directive({
  selector: '[raaTrapFocus]',
})
export class RaaTrapFocusDirective implements AfterViewInit, OnChanges {
  @Input('raaTrapFocus')
  initialFocusElement: ElementRef;

  @Input()
  trapDisabled = false;

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialFocusElement'] && changes['initialFocusElement'].currentValue) {
      (changes['initialFocusElement'].currentValue.nativeElement as HTMLElement).focus();
    }
  }

  ngAfterViewInit() {
    const tabbableElements = Array.prototype.slice
      .call(this.element.nativeElement.querySelectorAll('select, input, textarea, button, a, [role="button"]'))
      .filter((el: HTMLElement) => !el.hidden);

    if (tabbableElements && tabbableElements.length) {
      const first: HTMLElement = tabbableElements[0];
      const last: HTMLElement = tabbableElements[tabbableElements.length - 1];

      const elementToFocus: HTMLElement =
        this.initialFocusElement && this.initialFocusElement.nativeElement
          ? this.initialFocusElement.nativeElement
          : tabbableElements[0];

      if (elementToFocus && elementToFocus.focus) {
        elementToFocus.focus();
      }

      last.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!this.trapDisabled && e.which === TAB_KEY_CODE && !e.shiftKey) {
          e.preventDefault();
          first.focus();
        }
      });

      first.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!this.trapDisabled && e.which === TAB_KEY_CODE && e.shiftKey) {
          e.preventDefault();
          last.focus();
        }
      });
    }
  }
}
