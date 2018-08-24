import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'raa-overlay-spinner',
  templateUrl: './raa-overlay-spinner.component.html',
  styleUrls: ['./raa-overlay-spinner.component.scss'],
})
export class RaaOverlaySpinnerComponent implements OnInit {
  @Input()
  showSpinner: boolean;

  @Input()
  posAbsolute: boolean;

  @Input()
  posFixed: boolean;

  constructor() {}

  ngOnInit(): void {}
}
