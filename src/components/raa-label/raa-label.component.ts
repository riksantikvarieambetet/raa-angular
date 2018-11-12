import { Component, Input } from '@angular/core';

@Component({
  selector: 'raa-label',
  template:
    '<label class="raa-label tw-block">' +
    '<ng-content></ng-content>' +
    '<span class="tw-text-raa-error-red tw-text-raa-error-red tw-text-lg tw-h-4" *ngIf="required">&nbsp;*</span>' +
    '</label>',
  styleUrls: ['raa-label.component.scss'],
})
export class RaaLabel {
  @Input()
  required = false;

  constructor() {}
}
