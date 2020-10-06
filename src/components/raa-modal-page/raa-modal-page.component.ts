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

  @Output()
  outsideClick = new EventEmitter();

  @ViewChild('content', { static: false })
  modalContentChild: ElementRef<HTMLElement>;

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngAfterViewInit() {
    const tabbableElements = (Array.from(
      this.modalContentChild.nativeElement.querySelectorAll('select, input, textarea, button, a')
    ) as HTMLElement[]).filter((el: HTMLElement) => !el.hidden);

    if (tabbableElements.length) {
      tabbableElements[0].focus();
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  propagateOutsideClick() {
    this.outsideClick.emit('click');
  }
}
