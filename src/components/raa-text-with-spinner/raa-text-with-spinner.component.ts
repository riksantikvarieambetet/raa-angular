import { Component, Input } from '@angular/core';

@Component({
  selector: 'raa-text-with-spinner',
  template: `
    <div class="tw-relative">
      <div [ngClass]="{ 'tw-invisible': showSpinner }"><ng-content></ng-content></div>
      <div class="tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-left-0" [ngClass]="{ 'tw-hidden': !showSpinner }">
        <raa-spinner size="1rem"></raa-spinner>
      </div>
    </div>
  `,
})
export class RaaTextWithSpinner {
  @Input()
  showSpinner = false;
}
