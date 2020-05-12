import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterContentChecked,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'raa-dialog',
  templateUrl: './raa-dialog.component.html',
  styleUrls: ['./raa-dialog.component.scss'],
})
export class RaaDialogComponent implements OnInit, OnDestroy, AfterContentChecked {
  @Input()
  yes: Function;

  @Input()
  no: Function;

  @Input()
  ok: Function;

  @Input()
  cancel: Function;

  @Input()
  close: Function;

  @Input()
  header = '';

  @Output()
  outsideClick = new EventEmitter();

  @ViewChild('yesButton', { static: false })
  yesButton: ElementRef;

  @ViewChild('noButton', { static: false })
  noButton: ElementRef;

  @ViewChild('okButton', { static: false })
  okButton: ElementRef;

  @ViewChild('cancelButton', { static: false })
  cancelButton: ElementRef;

  focusElement: ElementRef;

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  ngAfterContentChecked() {
    if (this.cancelButton) {
      this.focusElement = this.cancelButton;
    } else if (this.okButton) {
      this.focusElement = this.okButton;
    } else if (this.noButton) {
      this.focusElement = this.noButton;
    } else {
      this.focusElement = this.yesButton;
    }
  }

  propagateOutsideClick() {
    this.outsideClick.emit('click');
  }
}
