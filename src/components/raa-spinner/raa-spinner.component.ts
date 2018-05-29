import { Component, Input } from '@angular/core';

@Component({
    selector: 'raa-spinner',
    template: `
    <div class="raa-spinner" *ngIf="loading">
        <i class="raa-icon-hourglass"></i>
    </div>
    `,
    styleUrls: ['raa-spinner.component.scss']
})
export class RaaSpinnerComponent {
    @Input()
    loading: boolean = false;
    constructor() {}
}