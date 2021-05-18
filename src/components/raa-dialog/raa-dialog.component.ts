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
  @Input() proceed: Function;
  @Input() cancel: Function;
  @Input() proceedButtonText = 'Ok';
  @Input() cancelButtonText = 'Avbryt';
  @Input() close: Function;
  @Input() header = '';
  @Input() width = 20;
  @Input() reverseButtons = false;

  @Output() outsideClick = new EventEmitter<void>();

  @ViewChild('proceedButton') proceedButton: ElementRef;
  @ViewChild('cancelButton') cancelButton: ElementRef;

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
    } else {
      this.focusElement = this.proceedButton;
    }
  }

  propagateOutsideClick() {
    this.outsideClick.emit();
  }
}
