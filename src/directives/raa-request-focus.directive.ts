import { Directive, ElementRef, EventEmitter, Inject, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[requestFocus]',
})
export class RaaRequestFocusDirective implements OnInit {
  @Input('requestFocus') focusEvent: EventEmitter<boolean>;

  constructor(@Inject(ElementRef) private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.focusEvent.subscribe(() => {
      const el = this.renderer.selectRootElement(this.element.nativeElement);
      el.focus();
    });
  }
}
