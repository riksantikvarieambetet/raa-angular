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
  header: string = '';

  @Output()
  outsideClick = new EventEmitter();

  @ViewChild('yesButton')
  yesButton: ElementRef;

  @ViewChild('noButton')
  noButton: ElementRef;

  @ViewChild('okButton')
  okButton: ElementRef;

  @ViewChild('cancelButton')
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
