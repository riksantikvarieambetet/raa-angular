import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

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
export class RaaPaginatorComponent implements AfterViewInit {
  @Input() paginatorId = 'raa-paginator';
  @Output() pageChanged = new EventEmitter<number>();

  @ViewChild('selectedPage', { static: false }) selectedPage: ElementRef;

  ngAfterViewInit() {
    if (this.selectedPage) {
      (this.selectedPage.nativeElement as HTMLElement).focus();
    }
  }
}
