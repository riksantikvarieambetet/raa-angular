import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';

@Component({
    selector: 'raa-modal-page',
    templateUrl: './raa-modal-page.component.html',
    styleUrls: ['./raa-modal-page.component.scss']
})
export class RaaModalPageComponent implements AfterViewInit {

  @Input()
    onClose: Function;

  @Input()
  header: string;

  @Input()
  size: 'small' | 'large';

  constructor (
    private element: ElementRef
  ) {}

  ngAfterViewInit() {

    let tabbableElements = Array.prototype.slice.call(this.element.nativeElement.querySelectorAll('select, input, textarea, button, a'))
        .filter((el: HTMLElement) => !el.hidden);

    if (tabbableElements && tabbableElements.length) {

        let first = tabbableElements[0];
        let last = tabbableElements[tabbableElements.length - 1];

        let buttonToFocus = this.onClose ? 1 : 0;

        tabbableElements[buttonToFocus].focus();

        last.addEventListener('keydown', function (e: KeyboardEvent) {
            if ((e.which === 9 && !e.shiftKey)) {
                e.preventDefault();
                first.focus();
            }
        });

        first.addEventListener('keydown', function (e: KeyboardEvent) {
            if ((e.which === 9 && e.shiftKey)) {
                e.preventDefault();
                last.focus();
            }
        });
    }
  }

}

