import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'raa-overlay-spinner',
  templateUrl: './raa-overlay-spinner.component.html',
  styleUrls: ['./raa-overlay-spinner.component.scss'],
})
export class RaaOverlaySpinnerComponent implements AfterViewInit {
  @Input()
  posAbsolute: boolean;

  @Input()
  posFixed: boolean;

  @ViewChild('raaSpinner', { static: true }) spinner: ElementRef;

  private focusedElement: Element;

  ngAfterViewInit() {
    // Leta upp tidigare fokuserat element och spara en referens till den
    // så att vi kan sätta tillbaka fokus på samma element när komponenten dör.
    if (document.activeElement) {
      this.focusedElement = document.activeElement;
      (document.activeElement as HTMLElement).blur();
    }

    if (this.spinner) {
      this.spinner.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    if (this.focusedElement) {
      (this.focusedElement as HTMLElement).focus();
    }
  }
}
