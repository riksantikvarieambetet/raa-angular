import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  HostListener
} from '@angular/core';

import { debounce } from 'lodash';

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
  private element: HTMLElement; // raa-select

  @Input()
  moveUpHeightThreshold = 120;

  @Input()
  parentConstrictor?: HTMLElement;

  @Output()
  private dropdownMovedUp = new EventEmitter<boolean>(true);

  @Output()
  private parentScrolled = new EventEmitter<string>(true);

  @ViewChild('dropdown')
  private dropdownElementRef: ElementRef;

  @HostListener('window:scroll', ['$event'])
  onDocumentScroll() {
    this.handleDropdownPositionAndSize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.handleDropdownPositionAndSize();
  }

  private dropdown: HTMLElement;
  private parent: HTMLElement;
  private raaSelectIsVisible: boolean;
  private maxDropdownHeight: number;
  private debouncedParentScroll = debounce(() => {
    this.parentScrolled.emit('scrolled');
  }, 10, { 'maxWait': 10 });

  constructor() {
  }

  ngOnInit() {
    this.dropdown = (this.dropdownElementRef.nativeElement as HTMLElement).firstElementChild as HTMLElement;
    this.parent = this.parentConstrictor || this.getParent(this.element);
    this.parent.addEventListener('scroll', () => {
      this.onParentScroll();
    });
    // this.parentScrolled.subscribe(() => {
    //   console.info('parent scrolled');
    //   this.onParentScroll();
    // });
  }


  ngAfterViewInit() {
    this.handleDropdownPositionAndSize();
  }

  onDebounceScroll() {
    this.parentScrolled.emit('scrolled');
  }

  onParentScroll() {
    console.info('parent scrolled');
    this.handleDropdownPositionAndSize();
    if (this.element && this.parent) {
      // console.info('this.element.getBoundingClientRect():', this.element.getBoundingClientRect());
      // console.info('this.parent.getBoundingClientRect()', this.parent.getBoundingClientRect());
      // this.raaSelectIsVisible = this.element.getBoundingClientRect().top <= this.parent.getBoundingClientRect().bottom || this.element.getBoundingClientRect().bottom >= this.parent.getBoundingClientRect().top;
      this.raaSelectIsVisible = !(
        (Math.round(this.element.getBoundingClientRect().top) > Math.round(this.parent.getBoundingClientRect().bottom))
        || (Math.round(this.element.getBoundingClientRect().bottom) < Math.round(this.parent.getBoundingClientRect().top))
      );

      // console.info('this.raaSelectIsVisible', this.raaSelectIsVisible);
      // console.info(' this.dropdown.style.display', this.dropdown.style.display);
      if (!this.raaSelectIsVisible && this.dropdown.style.visibility !== 'hidden') {
        this.dropdown.style.visibility = 'hidden';
        // this.maxDropdownHeightAtMomentOfHiding = this.maxDropdownHeight;
      } else if (this.raaSelectIsVisible && this.dropdown.style.visibility === 'hidden') {
        this.dropdown.style.visibility = 'visible';
        // this.dropdown.style.maxHeight = (this.maxDropdownHeightAtMomentOfHiding > this.maxDropdownHeight) ? `${this.maxDropdownHeightAtMomentOfHiding}px` : `${this.maxDropdownHeight}px`;
      }
    }
    // console.info('this.maxDropdownHeight', this.maxDropdownHeight);
    // this.parentScrolled.emit(this.parent.getBoundingClientRect());

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
    // Justerar max-höjden beroende på hur mycket plats som finns tillgängligt. Lämnar 10px för att det ser trevligare ut då
    const maxDropdownHeight = this.getMaxDropdownHeight(spaceAbove - EXTRA_SPACING);
    this.maxDropdownHeight = maxDropdownHeight;
    const topOffset = this.element.getBoundingClientRect().top - ( maxDropdownHeight + this.element.getBoundingClientRect().height);

    this.setBasicDropdownDimensions(maxDropdownHeight, topOffset);
    this.dropdownMovedUp.emit(true);
    const offsetFromInputTop = this.dropdown.getBoundingClientRect().bottom - this.element.getBoundingClientRect().top;
    const dropdownListIsAboveSelectField = this.dropdown.getBoundingClientRect().bottom > this.element.getBoundingClientRect().top;
    const dropdownListIsBelowSelectField = this.element.getBoundingClientRect().top > this.dropdown.getBoundingClientRect().bottom;
    const offsetFromInputTopIsLessThanDropdownsHeight = offsetFromInputTop < this.dropdown.getBoundingClientRect().height;
    const offsetFromInputTopIsGreaterThanOrEqualToSelectFieldHeight = Math.abs(offsetFromInputTop) >= this.element.getBoundingClientRect().height;

    if (dropdownListIsAboveSelectField) {
      if (offsetFromInputTopIsLessThanDropdownsHeight) {
        // console.info('setBasicDropdownDimensions offsetFromInputTopIsLessThanDropdownsHeight', offsetFromInputTopIsLessThanDropdownsHeight);
        this.dropdown.style.top = (this.dropdown.getBoundingClientRect().top - this.element.getBoundingClientRect().height - (offsetFromInputTop * 2)) + 'px'; // Trial and error
      }

    } else if (dropdownListIsBelowSelectField) {
      // console.info('setBasicDropdownDimensions dropdownListIsBelowSelectField');
      // console.info('this.dropdown.getBoundingClientRect()', this.dropdown.getBoundingClientRect());
      // console.info('this.element.getBoundingClientRect()', this.element.getBoundingClientRect());
      if (offsetFromInputTopIsGreaterThanOrEqualToSelectFieldHeight) {
        // console.info('setBasicDropdownDimensions dropdownListIsBelowSelectField');
        this.dropdown.style.top = (this.dropdown.getBoundingClientRect().top - Math.abs(this.element.getBoundingClientRect().height) - (offsetFromInputTop * 2)) + 'px'; // Trial and error
      }
    }

  }

  private setDropdownBelow(spaceBelow: number) {
    // Justerar max höjden beroden på hur mycket plats som finns kvar under. Lämnar 10px för att ser trevligare ut då
    const maxDropdownHeight = this.getMaxDropdownHeight(spaceBelow - EXTRA_SPACING);
    this.maxDropdownHeight = maxDropdownHeight;
    const topOffset = (this.element.getBoundingClientRect().bottom === (<HTMLElement>this.dropdown.parentElement).getBoundingClientRect().top) ?
      this.element.getBoundingClientRect().top : this.element.getBoundingClientRect().bottom;
    this.setBasicDropdownDimensions(maxDropdownHeight, topOffset);

    const dropdownListIsAtSameLevelAsSelectField = Math.round(this.element.getBoundingClientRect().top) === Math.round(this.dropdown.getBoundingClientRect().top);

    const dropdownListIsBelowSelectField = Math.round(this.dropdown.getBoundingClientRect().top) > Math.round(this.element.getBoundingClientRect().bottom);

    // console.info('setDropdownBelow ');
    // console.info('this.dropdown.getBoundingClientRect()', this.dropdown.getBoundingClientRect());
    // console.info('this.element.getBoundingClientRect()', this.element.getBoundingClientRect());
    if (dropdownListIsAtSameLevelAsSelectField) {
      // console.info('setDropdownBelow dropdownListIsAtSameLevelAsSelectField');
      this.dropdown.style.top = this.element.getBoundingClientRect().bottom + 'px';
    } else {
      if (dropdownListIsBelowSelectField) {
        // console.info('setDropdownBelow dropdownListIsBelowSelectField');
        const offsetFromInputBottom = this.dropdown.getBoundingClientRect().top - this.element.getBoundingClientRect().bottom;
        this.dropdown.style.top = (this.element.getBoundingClientRect().top - offsetFromInputBottom) + 'px'; // Trial and error
      }
    }

    this.dropdownMovedUp.emit(false);
  }

  private setBasicDropdownDimensions(maxDropdownHeight: number, topOffset: number) {
    this.dropdown.style.maxHeight = `${maxDropdownHeight}px`;

    this.dropdown.style.position = 'fixed';
    this.dropdown.style.top = `${topOffset}px`;
    this.dropdown.style.width = `${this.element.getBoundingClientRect().width}px`;
    this.dropdown.style.left = `${this.element.getBoundingClientRect().left }px`;
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
