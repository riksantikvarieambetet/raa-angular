import { Directive, ElementRef, EventEmitter, Inject, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[raaRequestFocus]',
})
export class RaaRequestFocusDirective implements OnInit {
  @Input('raaRequestFocus') focusEvent: EventEmitter<boolean>;

  constructor(@Inject(ElementRef) private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.focusEvent.subscribe(() => {
      const el: HTMLElement = this.renderer.selectRootElement(this.element.nativeElement);
      el.focus();
    });
  }
}
