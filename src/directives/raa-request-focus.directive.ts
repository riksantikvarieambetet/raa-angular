import { Directive, ElementRef, Input, EventEmitter } from "@angular/core";

@Directive({
  selector: "[requestFocus]"
})
export class RaaRequestFocusDirective {
  private focusEmitterSubscription: EventEmitter<any>;
  // Now we expect EventEmitter as binded value
  @Input('requestFocus')
  set requestFocus(focusEmitter: EventEmitter<any>) {
    if (this.focusEmitterSubscription) {
      this.focusEmitterSubscription.unsubscribe();
    }
    this.focusEmitterSubscription = focusEmitter.subscribe(() => this.element.nativeElement.focus())
  }
  constructor(private element: ElementRef) { }
}