import { Component, Input } from '@angular/core';

@Component({
  selector: 'raa-label',
  template: '<label class="label"><ng-content></ng-content><span class="red" *ngIf="required">&nbsp;*</span></label>',
  styleUrls: ['raa-label.component.scss'],
})
export class RaaLabel {
  @Input()
  required: boolean;

  constructor() {}
}
