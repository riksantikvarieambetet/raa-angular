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
import * as $ from 'jquery';

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

  @Input()
  parentConstrictor?: HTMLElement;

  @Output()
  private dropdownMovedUp = new EventEmitter<boolean>(true);

  @ViewChild('dropdown')
  private dropdownElementRef: ElementRef;

  private dropdown: HTMLElement;
  private parent: HTMLElement;

  constructor() {
  }

  ngOnInit() {
    this.dropdown = (this.dropdownElementRef.nativeElement as HTMLElement).firstElementChild as HTMLElement;
    this.parent = this.parentConstrictor || this.getParent(this.element);
  }

  ngAfterViewInit() {
    this.handleDropdownPositionAndSize();
    console.info('this.parentConstrictor', this.parentConstrictor);
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
    console.info('******************setDropdownBelow********************');
    // Justerar max höjden beroden på hur mycket plats som finns kvar under. Lämnar 10px för att ser trevligare ut då
    const maxDropdownHeight = this.getMaxDropdownHeight(spaceBelow - EXTRA_SPACING);
    const topOffset = (this.element.getBoundingClientRect().bottom === (<HTMLElement>this.dropdown.parentElement).getBoundingClientRect().top) ?
      this.element.getBoundingClientRect().top : this.element.getBoundingClientRect().bottom;
    this.dropdown.style.maxHeight = `${maxDropdownHeight}px`;
    this.dropdown.style.position = 'fixed';
    this.dropdown.style.top = `${ topOffset}px`;
    this.dropdown.style.width = `${this.element.getBoundingClientRect().width}px`;
    this.dropdown.style.left = `${this.element.getBoundingClientRect().left }px`;
    console.info('$(this.dropdown).offset()', $(this.dropdown).offset());
    console.info('$(this.element).offset()', $(this.element).offset());
    console.info('(<HTMLElement>this.dropdown.parentElement)', $((<HTMLElement>this.dropdown.parentElement)).offset());
    console.info('this.element', this.element);
    console.info('topOffset', topOffset);
    console.info('this.dropdown.getBoundingClientRect()', this.dropdown.getBoundingClientRect());
    console.info('this.element.getBoundingClientRect()', this.element.getBoundingClientRect());
    console.info('this.dropdown.parentElement.getBoundingClientRect', (<HTMLElement>this.dropdown.parentElement).getBoundingClientRect());

    console.info('this.dropdown.style', this.dropdown.style);
    console.info('this.dropdown.parentElement', this.dropdown.parentElement);

    if (this.element.getBoundingClientRect().top === this.dropdown.getBoundingClientRect().top) {
      this.dropdown.style.top = this.element.getBoundingClientRect().bottom + 'px';
    } else {
      if (this.dropdown.getBoundingClientRect().top > this.element.getBoundingClientRect().bottom) {
        // const offsetTopThroughJQuery: number = (<any>$(this.dropdown).offset()).top || 0;
        // const offsetTopThroughJQuery: number = this.dropdown.getBoundingClientRect().top;
        const offsetFromInputBottom = this.dropdown.getBoundingClientRect().top - this.element.getBoundingClientRect().bottom;
        this.dropdown.style.top = (this.element.getBoundingClientRect().top - offsetFromInputBottom) + 'px'; // Trial and error
        console.info('offsetFromInputBottom top', this.dropdown.getBoundingClientRect().top);
        console.info('offsetFromInputBottom', offsetFromInputBottom);
      }

    }

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
