import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[raaSelectAllOnFocus]',
})
export class RaaSelectAllOnFocusDirective {
  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('focus')
  onFocus() {
    this.elementRef.nativeElement.select();
  }
}
