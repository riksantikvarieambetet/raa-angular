import { Component, Input } from '@angular/core';

@Component({
  selector: 'raa-overlay-spinner',
  templateUrl: './raa-overlay-spinner.component.html',
  styleUrls: ['./raa-overlay-spinner.component.scss'],
})
export class RaaOverlaySpinnerComponent {
  @Input()
  posAbsolute: boolean;

  @Input()
  posFixed: boolean;
}
