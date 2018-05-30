import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'raa-text-with-spinner',
  template:
  `<div class="raa-text-with-spinner">
        <div [ngClass]="{'hide': showSpinner}"><ng-content></ng-content></div>
        <div class="spinner" [ngClass]="{'no-display': !showSpinner}">
          <raa-spinner [showSpinner]="showSpinner"></raa-spinner>
        </div>
   </div>`,
  styleUrls: ['raa-text-with-spinner.component.scss']
})
export class RaaTextWithSpinner implements OnInit {

  @Input()
  showSpinner: boolean = false;

  ngOnInit() {

    if (typeof this.showSpinner !== 'boolean') {
      throw 'ERROR: raa-select.component -> showSpinner must be specified (boolean)';
    }

  }
}