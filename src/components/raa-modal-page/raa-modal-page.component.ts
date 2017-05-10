import { Component, Input } from '@angular/core';

@Component({
    selector: 'raa-modal-page',
    templateUrl: './raa-modal-page.component.html',
    styleUrls: ['./raa-modal-page.component.scss']
})
export class RaaModalPageComponent {

    @Input()
    onClose: Function;

    @Input()
    header: string;

    @Input()
    size: 'small' | 'large';

}

