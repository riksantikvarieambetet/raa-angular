import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'raa-modal-page',
    templateUrl: './raa-modal-page.component.html',
    styleUrls: ['./raa-modal-page.component.scss']
})
export class RaaModalPageComponent implements OnInit, OnDestroy {

  @Input()
    onClose: Function;

  @Input()
  header: string;

  @Input()
  size: 'small' | 'large';

    ngOnInit() {
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = 'hidden';
      } else {
        throw new Error('Kan inte hämta ut <body> från dokumentet');
      }
    }

    ngOnDestroy() {
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = 'auto';
      }
    }

}

