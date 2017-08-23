import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[raaOutsideClick]'
})
export class OutsideClickDirective {
  // Vi måste lyssna på mouseup eller mousedown istället för click. Vid klick så kan element ha tagit borts från DOM:en och då ge ett
  // felaktigt "utanförklick".
  @HostListener('document:mouseup', ['$event'])
  onClick(event: MouseEvent) {
    this.handleClick(event);
  }

  @Output('raaOutsideClick')
  onOutsideClick = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef
  ) { }

  private handleClick(event: MouseEvent) {
      const containerElement = this.elementRef.nativeElement as HTMLElement;
      const targetExistsInContainer = containerElement.contains(event.target as Node);

      if (!targetExistsInContainer) {
        this.onOutsideClick.emit();
      }
  }
}