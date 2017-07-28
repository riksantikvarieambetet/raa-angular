import {
  Directive,
  ElementRef,
  Output,
  Renderer,
  OnInit,
  EventEmitter
} from '@angular/core';

@Directive({
  selector: '[raaOutsideClick]'
})
export class OutsideClickDirective implements OnInit {

  @Output('raaOutsideClick')
  onOutsideClick = new EventEmitter<void>();

  private cancelListener: Function;

  private firstTime = true;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer
  ) {  }

  ngOnInit() {
    this.cancelListener = this.renderer.listenGlobal('document', 'click', (event: MouseEvent) => this.handleClick(event));
  }

  ngOnDestroy() {
    this.cancelListener();
  }

  private handleClick(event: MouseEvent) {
    if (!this.firstTime) {
      const el = this.elementRef.nativeElement as HTMLElement;
      const active = el.contains(event.target as Node);

      if (!active) {
        this.onOutsideClick.emit();
      }
    } else {
      this.firstTime = false;
    }
  }
}