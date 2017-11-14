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
        document.querySelector('body').style.overflow = 'hidden';
    }

    ngOnDestroy() {
        document.querySelector('body').style.overflow = 'auto';
    }

}

