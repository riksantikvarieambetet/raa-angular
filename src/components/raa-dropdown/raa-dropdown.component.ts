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

const EXTRA_SPACING = 10;

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
    console.info('Init raa-select'); 
  }

  ngAfterViewInit() {
    this.handleDropdownPositionAndSize();
  }

  private handleDropdownPositionAndSize() {
    const spaceAbove = this.element.getBoundingClientRect().top - this.parent.getBoundingClientRect().top;
    const spaceBelow = this.getViewBottomPosition() - this.element.getBoundingClientRect().bottom;
    const dropdownHeight = this.dropdown.getBoundingClientRect().height;

    if (spaceBelow < dropdownHeight + EXTRA_SPACING
      && spaceBelow < this.moveUpHeightThreshold
      && spaceAbove > spaceBelow) {
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
    // genom att sätta om top till auto och bottom till 0 så så får vi ingen overflow
    this.dropdown.style.top = 'auto';
    this.dropdown.style.bottom = '0';
    const pixelsToMoveDropdownUp = this.element.getBoundingClientRect().height;
    this.dropdown.style.transform += `translateY(-${pixelsToMoveDropdownUp}px)`;

    // Justerar max-höjden beroende på hur mycket plats som finns tillgängligt. Lämnar 10px för att det ser trevligare ut då
    const maxDropdownHeight = this.getMaxDropdownHeight(spaceAbove - EXTRA_SPACING);
    this.dropdown.style.maxHeight = `${maxDropdownHeight}px`;
    this.dropdownMovedUp.emit(true);
  }

  private setDropdownBelow(spaceBelow: number) {
    // Justerar max höjden beroden på hur mycket plats som finns kvar under. Lämnar 10px för att ser trevligare ut då
    const maxDropdownHeight = this.getMaxDropdownHeight(spaceBelow - EXTRA_SPACING);
    this.dropdown.style.maxHeight = `${maxDropdownHeight}px`;
    this.dropdownMovedUp.emit(false);
  }

  private getMaxDropdownHeight(availableSpace: number) {
    return Math.min(availableSpace, this.dropdown.getBoundingClientRect().height);
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
