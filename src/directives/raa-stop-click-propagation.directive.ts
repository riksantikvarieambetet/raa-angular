import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[raaStopClickPropagation]'
})
export class RaaStopClickPropagationDirective {
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();
  }

  constructor() { }
}