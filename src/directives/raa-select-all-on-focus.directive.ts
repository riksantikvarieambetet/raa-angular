import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[raaSelectAllOnFocus]',
})
export class RaaSelectAllOnFocusDirective {
  constructor(private el: ElementRef) {}

  @HostListener('focus')
  onFocus() {
    this.el.nativeElement.select();
  }
}
