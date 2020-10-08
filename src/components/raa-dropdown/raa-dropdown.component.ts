import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { throttle } from 'lodash-es';

const EXTRA_SPACING = 10;
const DEFAULT_MAX_HEIGHT = 500;

/**
 * Komponent för att justera höjden på en dropdown så att den får plats inom en scrollpane, om den inte får plats försöker vi
 * flytta upp dropdownen ovanför elementet om det finns mer plats där
 */
@Component({
  selector: 'raa-dropdown',
  templateUrl: './raa-dropdown.component.html',
  styleUrls: ['./raa-dropdown.component.scss'],
})
export class RaaDropdownComponent implements OnInit, AfterViewInit, OnDestroy {
  private dropdown: HTMLElement;
  private preferredHeight: number;
  private parent: HTMLElement;
  private throttledParentScroll = throttle(() => {
    this.onParentScroll();
  }, 16);

  @Input()
  private element: HTMLElement;

  @Input()
  moveUpHeightThreshold = 120;

  @Input()
  appendToBody = false;

  @Input()
  dropdownBodyZIndex = '1000';

  @Output()
  private dropdownMovedUp = new EventEmitter<boolean>(true);

  @Output()
  private dropdownHeight = new EventEmitter<number>();

  @ViewChild('dropdown', { static: true })
  private dropdownElementRef: ElementRef;

  @HostListener('window:resize', ['$event'])
  onWindowResize(_event: Event) {
    this.throttledParentScroll();
  }

  ngOnInit() {
    this.dropdown = (this.dropdownElementRef.nativeElement as HTMLElement).firstElementChild as HTMLElement;
    this.parent = this.getParent(this.element);
    this.parent.addEventListener('scroll', this.throttledParentScroll);
  }

  ngAfterViewInit() {
    this.preferredHeight = this.getDropdownPreferredMaxHeight();
    const elementBoundingClientRect = this.element.getBoundingClientRect();
    const parentBoundingClientRect = this.parent.getBoundingClientRect();

    this.tryToScrollElementIntoView(elementBoundingClientRect, parentBoundingClientRect);
    this.setDropdownPositionFixed();
    if (this.appendToBody) {
      this.appendDropdownToBody();
    }
    this.handleDropdownPositionAndSize(elementBoundingClientRect);
  }

  ngOnDestroy() {
    this.parent.removeEventListener('scroll', this.throttledParentScroll);

    if (this.appendToBody) {
      document.body.removeChild(this.dropdown);
    }
  }

  onParentScroll() {
    const elementBoundingClientRect = this.element.getBoundingClientRect();
    const parentBoundingClientRect = this.parent.getBoundingClientRect();

    const dropdownPosition = this.handleDropdownPositionAndSize(elementBoundingClientRect);
    if (this.element && this.parent) {
      const elementIsVisibleWithinScrollView = this.isElementVisibleWithinScrollView(
        dropdownPosition,
        elementBoundingClientRect,
        parentBoundingClientRect
      );
      if (!elementIsVisibleWithinScrollView && this.dropdown.style.visibility !== 'hidden') {
        this.dropdown.style.visibility = 'hidden';
      } else if (elementIsVisibleWithinScrollView && this.dropdown.style.visibility === 'hidden') {
        this.dropdown.style.visibility = 'visible';
      }
    }
  }

  private getDropdownPreferredMaxHeight() {
    const maxHeight =
      document.defaultView && document.defaultView.getComputedStyle(this.dropdown).getPropertyValue('max-height');
    if (maxHeight && maxHeight.length !== 0) {
      return Number(maxHeight.replace(/\D/g, ''));
    }

    return DEFAULT_MAX_HEIGHT;
  }

  private setDropdownPositionFixed() {
    this.dropdown.style.width = `${this.dropdown.getBoundingClientRect().width}px`;
    this.dropdown.style.left = `${this.element.getBoundingClientRect().left}px`;
    this.dropdown.style.position = 'fixed';

    // Sätter transalteZ(0) för att tvinga IE att rita om elementet, blir annars halvtransparant
    // när den visas utanför sin container
    if (!this.appendToBody) {
      this.dropdown.style.transform = 'translateZ(0)';
    }
  }

  private handleDropdownPositionAndSize(elementBoundingClientRect: ClientRect): DropdownPositon {
    const dropdownBoundingClientRect = this.dropdown.getBoundingClientRect();
    const documentBoundingClientRect = document.body.getBoundingClientRect();

    const spaceAbove = elementBoundingClientRect.top - documentBoundingClientRect.top;
    const spaceBelow = documentBoundingClientRect.bottom - elementBoundingClientRect.bottom;
    const dropdownHeight = dropdownBoundingClientRect.height;

    if (
      spaceBelow < dropdownHeight + EXTRA_SPACING &&
      spaceBelow < this.moveUpHeightThreshold &&
      spaceAbove > spaceBelow
    ) {
      this.setDropdownAbove(spaceAbove, documentBoundingClientRect, elementBoundingClientRect);
      return 'ABOVE';
    }

    this.setDropdownBelow(spaceBelow, elementBoundingClientRect);
    return 'BELOW';
  }

  private setDropdownAbove(
    spaceAbove: number,
    documentBoundingClientRect: ClientRect,
    elementBoundingClientRect: ClientRect
  ) {
    const maxDropdownHeight = this.getMaxDropdownHeight(spaceAbove - EXTRA_SPACING);
    const dropdownBottomPosFromBodyBottom = documentBoundingClientRect.height - elementBoundingClientRect.top;

    // Sätter bottom position så att dropdownen kan växa och minska med height uppåt
    this.dropdown.style.bottom = `${dropdownBottomPosFromBodyBottom}px`;
    this.dropdown.style.maxHeight = `${maxDropdownHeight}px`;
    this.dropdown.style.top = `inherit`;

    this.dropdownMovedUp.emit(true);
    this.dropdownHeight.emit(maxDropdownHeight);
  }

  private setDropdownBelow(spaceBelow: number, elementBoundingClientRect: ClientRect) {
    const maxDropdownHeight = this.getMaxDropdownHeight(spaceBelow - EXTRA_SPACING);
    const dropdownTopPosition = elementBoundingClientRect.bottom;

    // Sätter top positionen så att dropdownen kan växa och minska med height nedåt
    this.dropdown.style.top = `${dropdownTopPosition}px`;
    this.dropdown.style.maxHeight = `${maxDropdownHeight}px`;
    this.dropdown.style.bottom = `inherit`;

    this.dropdownMovedUp.emit(false);
    this.dropdownHeight.emit(maxDropdownHeight);
  }

  private isElementVisibleWithinScrollView(
    dropdownPosition: DropdownPositon,
    elementBoundingClientRect: ClientRect,
    parentBoundingClientRect: ClientRect
  ) {
    if (dropdownPosition === 'BELOW') {
      return (
        elementBoundingClientRect.bottom < parentBoundingClientRect.bottom &&
        elementBoundingClientRect.bottom > parentBoundingClientRect.top
      );
    }

    return (
      elementBoundingClientRect.top < parentBoundingClientRect.bottom &&
      elementBoundingClientRect.top > parentBoundingClientRect.top
    );
  }

  private appendDropdownToBody() {
    document.body.appendChild(this.dropdown);
    this.dropdown.style.zIndex = this.dropdownBodyZIndex;
  }

  private getMaxDropdownHeight(availableSpace: number) {
    return Math.min(availableSpace, this.preferredHeight);
  }

  private getParent(element: HTMLElement) {
    return this.getScrollableParent(element) || document.body;
  }

  private getScrollableParent(element: HTMLElement) {
    const parents = this.getAllParents(element);

    return parents.find((node) => {
      const overflowY = window.getComputedStyle(node).overflowY;
      return overflowY !== 'visible' && overflowY !== 'hidden';
    });
  }

  private getAllParents(element: HTMLElement, elements: HTMLElement[] = []): HTMLElement[] {
    if (element.parentElement) {
      return this.getAllParents(element.parentElement, elements.concat(element));
    }

    return elements;
  }

  private tryToScrollElementIntoView(elementBoundingClientRect: ClientRect, parentBoundingClientRect: ClientRect) {
    if (!this.element || !this.parent || typeof this.parent.scrollTop === 'undefined') {
      return;
    }

    if (elementBoundingClientRect.bottom > parentBoundingClientRect.bottom) {
      this.parent.scrollTop =
        this.parent.scrollTop + elementBoundingClientRect.bottom - parentBoundingClientRect.bottom + 1;
    } else if (elementBoundingClientRect.top < parentBoundingClientRect.top) {
      this.parent.scrollTop =
        this.parent.scrollTop - (parentBoundingClientRect.top - elementBoundingClientRect.top + 1);
    }
  }
}

type DropdownPositon = 'ABOVE' | 'BELOW';
