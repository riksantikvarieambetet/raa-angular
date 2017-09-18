import { Component, Input, ViewChild, ElementRef, AfterContentChecked, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'raa-dialogue',
    templateUrl: './raa-dialogue.component.html',
    styleUrls: ['./raa-dialogue.component.scss']
})
export class RaaDialogueComponent implements OnInit, OnDestroy {

  @Input()
  onYes: Function;

  @Input()
  onNo: Function;

  @Input()
  onOk: Function;

  @Input()
  onCancel: Function;

  @Input()
  onClose: Function;

  @Input()
  header: string;

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
      document.querySelector('body').style.overflow = 'hidden';
  }

  ngOnDestroy() {
      document.querySelector('body').style.overflow = 'auto';
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
}

