import { Component } from '@angular/core';

@Component({
  selector: 'raa-label',
  template: '<label class="label"><ng-content></ng-content></label>',
  styleUrls: ['raa-label.component.scss']
})
export class RaaLabel {
  constructor() { }
}