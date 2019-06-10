import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'raa-modal-page',
  templateUrl: './raa-modal-page.component.html',
  styleUrls: ['./raa-modal-page.component.scss'],
})
export class RaaModalPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  close: Function;

  @Input()
  header: string;

  @Input()
  size: 'small' | 'large';

  @Input()
  focusTrapDisabled = false;

  @Output()
  outsideClick = new EventEmitter();

  @ViewChild('content', { static: false })
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

  propagateOutsideClick() {
    this.outsideClick.emit('click');
  }
}
