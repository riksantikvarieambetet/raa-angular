import { Component, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'raa-spinner',
    template: `
    <div class="raa-spinner" *ngIf="loading">
        <i class="fa fa-circle-o-notch fa-spin fa-fw"></i>
    </div>
    `,
    styleUrls: ['raa-spinner.component.scss']
})
export class RaaSpinnerComponent {
    @Input()
    loading: boolean = false;
    constructor() {}
}