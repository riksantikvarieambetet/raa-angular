import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

const closeConfirmationAnimationTime = 250;

const modalAnimation = [
  trigger('fade', [
    transition(':enter', [style({ opacity: 0 }), animate(`.3s ease`, style({ opacity: 0.4 }))]),
    transition(':leave', [style({ opacity: 0.4 }), animate(`.3s ease`, style({ opacity: 0 }))]),
  ]),
  trigger('closeConfirmationAnimation', [
    transition(':enter', [
      style({ transform: 'translateZ(0) translateY(100%)' }),
      animate(`${closeConfirmationAnimationTime}ms ease`, style({ transform: 'translateZ(0) translateY(0%)' })),
    ]),
    transition(':leave', [
      style({ transform: 'translateZ(0) translateY(0%)' }),
      animate(`${closeConfirmationAnimationTime}ms ease`, style({ transform: 'translateZ(0) translateY(100%)' })),
    ]),
  ]),
];

@Component({
  selector: 'raa-bottom-dialog',
  templateUrl: './raa-bottom-dialog.component.html',
  styleUrls: ['./raa-bottom-dialog.component.scss'],
  animations: [modalAnimation],
})
export class RaaBottomDialogComponent implements OnInit {
  @Input()
  isVisible: boolean;

  @Input()
  showLoadingSpinner: boolean;

  @Input()
  cancelBtnText: string;

  @Input()
  confirmBtnText: string;

  @Input()
  confirmBtnColor: 'green' | 'grey' | 'white' = 'white';

  @Input()
  fullHeight = false;

  @Input()
  header: string | null;

  @Input()
  message: string | null;

  @Output()
  onYesAction = new EventEmitter<void>();

  @Output()
  onNoAction = new EventEmitter<void>();

  buttonClass: string = 'raa-button-secondary';

  constructor() {}

  ngOnInit() {
    if (!this.cancelBtnText) {
      throw 'ERROR: raa-bottom-dialog.component -> cancelBtnText must be specified';
    }

    if (!this.confirmBtnText) {
      throw 'ERROR: raa-bottom-dialog.component -> confirmBtnText must be specified';
    }

    switch (this.confirmBtnColor) {
      case 'green':
        this.buttonClass = 'raa-button-confirm';
        break;
      case 'grey':
        this.buttonClass = 'raa-button-cancel';
        break;
      case 'white':
      default:
        this.buttonClass = 'raa-button-secondary';
    }
  }

  noAction() {
    this.onNoAction.emit();
  }

  yesAction() {
    this.onYesAction.emit();
  }
}
