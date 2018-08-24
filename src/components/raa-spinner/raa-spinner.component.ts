import { Component, Input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'raa-spinner',
  templateUrl: './raa-spinner.component.html',
  styleUrls: ['./raa-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaaSpinnerComponent {
  @Input() size = '7rem';

  constructor() {
  }

}
