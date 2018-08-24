import { Component, Input } from '@angular/core';

@Component({
  selector: 'raa-text-with-spinner',
  template: `<div class="raa-text-with-spinner">
        <div [ngClass]="{'hide': showSpinner}"><ng-content></ng-content></div>
        <div class="spinner" [ngClass]="{'no-display': !showSpinner}">
          <raa-spinner size="1rem"></raa-spinner>
        </div>
   </div>`,
  styleUrls: ['raa-text-with-spinner.component.scss'],
})
export class RaaTextWithSpinner {
  @Input()
  showSpinner = false;
}
