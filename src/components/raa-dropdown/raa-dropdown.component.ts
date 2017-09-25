import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter
} from '@angular/core';

/**
 * Komponent för att justera höjden på en dropdown så att den får plats inom en scrollpane, om den inte får plats försöker vi
 * flytta upp dropdownen ovanför elementet om det finns mer plats där
 */
@Component({
  selector: 'raa-dropdown',
  templateUrl: './raa-dropdown.component.html',
  styleUrls: ['./raa-dropdown.component.scss']
})
export class RaaDropdownComponent implements OnInit, AfterViewInit {

  @Input()
  private element: HTMLElement;

  @Input()
  moveUpHeightThreshold = 120;

  @Output()
  private dropdownMovedUp = new EventEmitter<boolean>(true);

  @ViewChild('dropdown')
  private dropdownElementRef: ElementRef;

  private dropdown: HTMLElement;
  private parent: HTMLElement;

  constructor() { }

  ngOnInit() {
    this.dropdown = (this.dropdownElementRef.nativeElement as HTMLElement).firstElementChild as HTMLElement;
    this.parent = this.getParent(this.element);
  }

  ngAfterViewInit() {
    this.handleDropdownPositionAndSize();
  }

  private handleDropdownPositionAndSize() {
    const spaceAbove = this.element.getBoundingClientRect().top - this.parent.getBoundingClientRect().top;
    const spaceBelow = this.getViewBottomPosition() - this.element.getBoundingClientRect().bottom;

    if (spaceBelow < this.moveUpHeightThreshold && spaceAbove > spaceBelow) {
      this.setDropdownAbove(spaceAbove);
    }
    else {
      this.setDropdownBelow(spaceBelow);
    }
  }

  private getViewBottomPosition() {
    return this.parent.getBoundingClientRect().top + this.parent.clientHeight;
  }

  private setDropdownAbove(spaceAbove: number) {
    // IE11 har en bugg som gör att den overflow fortfarande blir kvar fast vi flyttar hela elementet med translate
    // genom att sätta om top  top till auto och istället sätta bottom till 0 så så får vi ingen overflow
    this.dropdown.style.top = 'auto';
    this.dropdown.style.bottom = '0';
    const pixelsToMoveDropdownUp = this.element.getBoundingClientRect().height;
    this.dropdown.style.transform += `translateY(-${pixelsToMoveDropdownUp}px)`;

    // Justerar max-höjden beroende på hur mycket plats som finns tillgängligt
    this.dropdown.style.maxHeight = `${spaceAbove}px`;
    this.dropdownMovedUp.emit(true);
  }

  private setDropdownBelow(spaceBelow: number) {
    // Justerar max höjden beroden på hur mycket plats som finns kvar under
    this.dropdown.style.maxHeight = `${spaceBelow}px`;
    this.dropdownMovedUp.emit(false);
  }

  private getParent(element: HTMLElement) {
    return this.getScrollableParent(element) || document.body;
  }

  private getScrollableParent(element: HTMLElement) {
    const parents = this.getAllParents(element);

    return parents.find(node => {
      let overflowY = window.getComputedStyle(node).overflowY;
      let isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';
      return isScrollable;
    });
  }

  private getAllParents(element: HTMLElement, elements: HTMLElement[] = []): HTMLElement[] {
    if (element.parentElement) {
      return this.getAllParents(element.parentElement, elements.concat(element));
    }

    return elements;
  }
}
