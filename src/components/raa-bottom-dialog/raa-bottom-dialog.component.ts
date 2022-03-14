import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

const closeConfirmationAnimationTime = 250;

const modalAnimation = [
  trigger('fade', [
    transition(':enter', [style({ opacity: 0 }), animate(`.3s ease`, style({ opacity: 0.75 }))]),
    transition(':leave', [style({ opacity: 0.75 }), animate(`.3s ease`, style({ opacity: 0 }))]),
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
  isVisible = false;

  @Input()
  showLoadingSpinner = false;

  @Input()
  cancelBtnText = '';

  @Input()
  confirmBtnText = '';

  @Input()
  confirmBtnColor: 'green' | 'grey' | 'white' = 'white';

  @Input()
  confirmBtnDisabled = false;

  @Input()
  fullHeight = false;

  @Input()
  header: string | null = null;

  @Input()
  message: string | null = null;

  @Input()
  hideOverlay = false;

  @Input()
  background: 'tw-bg-raa-gray-2' | 'tw-bg-raa-white' = 'tw-bg-raa-gray-2';

  @Output()
  onYesAction = new EventEmitter<void>();

  @Output()
  onNoAction = new EventEmitter<void>();

  @ViewChild('cancelButton', { static: false })
  cancelButton: ElementRef;

  buttonClass = 'raa-button-secondary';

  ngOnInit() {
    if (!this.cancelBtnText) {
      throw new Error('ERROR: raa-bottom-dialog.component -> cancelBtnText must be specified');
    }

    if (!this.confirmBtnText) {
      throw new Error('ERROR: raa-bottom-dialog.component -> confirmBtnText must be specified');
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

  focusOnInit() {
    if (this.isVisible && this.cancelButton) {
      (this.cancelButton.nativeElement as HTMLElement).focus();
    }
  }

  noAction() {
    this.onNoAction.emit();
  }

  yesAction() {
    this.onYesAction.emit();
  }
}
