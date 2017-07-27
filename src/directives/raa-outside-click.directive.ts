import { Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Directive({
  selector: '[outsideClick]'
})
export class OutsideClickDirective implements OnInit {

  @Input('outsideClick') clickOutsideCb: () => void;

  cancelListener: Function;

  constructor(
    private el: ElementRef,
    private renderer: Renderer
  ) {

    // if (!this.clickOutsideCb) {
    //     throw 'ERROR: raa-select.component -> outsideClick must be specified (function)';
    // }

    let firstTime = true;
    let that = this;

    this.cancelListener = this.renderer.listenGlobal('document', 'click', handleClick);

    function handleClick(event: MouseEvent) {

      if (!firstTime) {
        const active = that.el.nativeElement.contains(event.target);
        if (!active) {
          that.clickOutsideCb();
        }
      }
      else {
        firstTime = false;
      }
    }
  }

  ngOnInit() {
    if (!this.clickOutsideCb) {
      throw 'ERROR: raa-select.component -> outsideClick must be specified (function)';
    }
  }

  ngOnDestroy() {
    this.cancelListener();
  }
}