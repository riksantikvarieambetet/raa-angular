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
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    this.handleClick(event);
  }

  @Output('raaOutsideClick')
  onOutsideClick = new EventEmitter<void>();

  private firstTime = true;

  constructor(
    private elementRef: ElementRef
  ) { }

  private handleClick(event: MouseEvent) {
    if (!this.firstTime) {
      const containerElement = this.elementRef.nativeElement as HTMLElement;
      const targetExistsInContainer = containerElement.contains(event.target as Node);

      // Om det klickade elementet inte finns i containerElement och existerar i DOM:en har användaren klickat utanför.
      // Vi måste kontrollera att elementet finns i DOM:en för att ta hänsyn till att element kan tas bort vid klick inne i containerElement
      if (!targetExistsInContainer && this.existsInDOM((event.target))) {
        this.onOutsideClick.emit();
      }
    } else {
      this.firstTime = false;
    }
  }

  private existsInDOM(element: EventTarget) {
    return document.body.contains(element as Node);
  }
}