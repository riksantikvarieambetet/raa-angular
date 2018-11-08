import { Component, Input } from '@angular/core';

@Component({
  selector: 'raa-text-with-spinner',
  template: `<div class="tw-relative">
        <div [ngClass]="{'tw-invisible': showSpinner}"><ng-content></ng-content></div>
        <div class="tw-absolute tw-pin-t tw-pin-b tw-pin-r tw-pin-l" [ngClass]="{'tw-hidden': !showSpinner}">
          <raa-spinner size="1rem"></raa-spinner>
        </div>
   </div>`,
})
export class RaaTextWithSpinner {
  @Input()
  showSpinner = false;
}
