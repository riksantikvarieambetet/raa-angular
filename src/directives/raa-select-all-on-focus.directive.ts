import { Directive, ElementRef, HostListener, Input, EventEmitter } from "@angular/core";

@Directive({
  selector: '[raaSelectAllOnFocus]'
})
export class RaaSelectAllOnFocus {
  constructor(private el: ElementRef) {
  }

  @HostListener('focus') onFocus() {
    this.el.nativeElement.select();
  }
}