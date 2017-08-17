import { Component, AfterViewInit, Input, ElementRef } from '@angular/core';

@Component({
    selector: 'raa-dialogue',
    templateUrl: './raa-dialogue.component.html',
    styleUrls: ['./raa-dialogue.component.scss']
})
export class RaaDialogueComponent implements AfterViewInit {

  @Input()
  onYes: Function;

  @Input()
  onNo: Function;

  @Input()
  onOk: Function;

  @Input()
  onCancel: Function;

  @Input()
  onClose: Function;

  @Input()
  header: string;

  constructor(
    private element: ElementRef
  ) { }

  ngAfterViewInit(): void {

    if (!this.header) {
      throw 'ERROR: raa-dialogue.component -> header must be specified (string)';
    }

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

