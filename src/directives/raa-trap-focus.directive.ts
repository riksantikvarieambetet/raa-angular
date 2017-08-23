import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';

const TAB_KEY_CODE = 9;

@Directive({
  selector: '[raaTrapFocus]'
})
export class RaaTrapFocusDirective implements AfterViewInit{

  @Input()
  hasCloseCrossButton: boolean;

  constructor(
    private element: ElementRef
  ) { }

  ngAfterViewInit() {

    let tabbableElements = Array.prototype.slice.call(this.element.nativeElement.querySelectorAll('select, input, textarea, button, a'))
        .filter((el: HTMLElement) => !el.hidden);

    if (tabbableElements && tabbableElements.length) {

      let first = tabbableElements[0];
      let last = tabbableElements[tabbableElements.length - 1];

      let ElementToFocus = this.hasCloseCrossButton ? 1 : 0;

      if (tabbableElements[ElementToFocus]) {
        tabbableElements[ElementToFocus].focus();
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