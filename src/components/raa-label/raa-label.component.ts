import { Component, Input } from '@angular/core';

@Component({
  selector: 'raa-label',
  template: '<label class="label"><ng-content></ng-content><img src="./asterisk.png" *ngIf="required"></label>',
  styleUrls: ['raa-label.component.scss']
})
export class RaaLabel {

  @Input() required: boolean;

  constructor() { }
}