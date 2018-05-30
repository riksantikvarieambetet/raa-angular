import { Component, Input } from '@angular/core';

@Component({
    selector: 'raa-spinner',
    template: `
    <div class="raa-spinner" *ngIf="showSpinner">
        <i class="raa-icon-hourglass" title="Laddar innehåll..."></i>
    </div>
    `,
    styleUrls: ['raa-spinner.component.scss']
})
export class RaaSpinnerComponent {
    @Input()
    showSpinner: boolean = false;
    constructor() {}
}