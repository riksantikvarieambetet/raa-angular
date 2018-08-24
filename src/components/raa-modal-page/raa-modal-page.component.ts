import { Component, Input, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'raa-modal-page',
  templateUrl: './raa-modal-page.component.html',
  styleUrls: ['./raa-modal-page.component.scss'],
})
export class RaaModalPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  onClose: Function;

  @Input()
  header: string;

  @Input()
  size: 'small' | 'large';

  @Input()
  focusTrapDisabled = false;

  @ViewChild('content')
  modalContentChild: ElementRef<HTMLElement>;

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngAfterViewInit() {
    if (this.focusTrapDisabled) {
      this.modalContentChild.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }
}
