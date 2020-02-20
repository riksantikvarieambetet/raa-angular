import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'raa-paginator',
  templateUrl: './raa-paginator.component.html',
})

/**
 * Paginator komponent som ska användas i RAÄ projekt. Bygger på ngx-paginator.
 * Om flera paginators användas måste paginatorID sättas för att fungera korrekt.
 * För att se hur komponenten ska användas korrekt, titta på ngx-paginator dokumentation.
 * https://www.npmjs.com/package/ngx-pagination#api
 */
export class RaaPaginatorComponent {
  @Input() paginatorId = 'raa-paginator';
  @Output() pageChanged = new EventEmitter<number>();
}
