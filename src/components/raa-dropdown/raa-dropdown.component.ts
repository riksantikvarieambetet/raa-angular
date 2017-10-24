import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  HostListener,
  OnDestroy,
} from '@angular/core';

import { throttle } from 'lodash';

const EXTRA_SPACING = 10;
const DEFAULT_MAX_HEIGHT = 500;

/**
 * Komponent för att justera höjden på en dropdown så att den får plats inom en scrollpane, om den inte får plats försöker vi
 * flytta upp dropdownen ovanför elementet om det finns mer plats där
 */
@Component({
  selector: 'raa-dropdown',
  templateUrl: './raa-dropdown.component.html',
  styleUrls: ['./raa-dropdown.component.scss']
})
export class RaaDropdownComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  private element: HTMLElement;

  @Input()
  moveUpHeightThreshold = 120;

  @Output()
  private dropdownMovedUp = new EventEmitter<boolean>(true);

  @ViewChild('dropdown')
  private dropdownElementRef: ElementRef;

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.throttledParentScroll();
  }

  private dropdown: HTMLElement;
  private preferredHeight: number;
  private parent: HTMLElement;
  private throttledParentScroll = throttle(() => {
    this.onParentScroll();
  }, 16);

  constructor() {
  }

  ngOnInit() {
    this.dropdown = (this.dropdownElementRef.nativeElement as HTMLElement).firstElementChild as HTMLElement;
    this.parent = this.getParent(this.element);
    this.parent.addEventListener('scroll', this.throttledParentScroll);
  }

  ngOnDestroy() {
    this.parent.removeEventListener('scroll', this.throttledParentScroll);
  }

  ngAfterViewInit() {
    this.preferredHeight = this.getDropdownPreferredMaxHeight();

    this.setDropdownPositionFixed();
    this.handleDropdownPositionAndSize();
  }

  onParentScroll() {
    this.handleDropdownPositionAndSize();
    if (this.element && this.parent) {
      const elementIsVisibleWithinScrollView = !(
        (Math.round(this.element.getBoundingClientRect().top) > Math.round(this.parent.getBoundingClientRect().bottom))
        || (Math.round(this.element.getBoundingClientRect().bottom) < Math.round(this.parent.getBoundingClientRect().top))
      );

      if (!elementIsVisibleWithinScrollView && this.dropdown.style.visibility !== 'hidden') {
        this.dropdown.style.visibility = 'hidden';
      } else if (elementIsVisibleWithinScrollView && this.dropdown.style.visibility === 'hidden') {
        this.dropdown.style.visibility = 'visible';
      }
    }
  }

  private getDropdownPreferredMaxHeight() {
    const maxHeight = document.defaultView.getComputedStyle(this.dropdown).getPropertyValue('max-height');
    if (maxHeight.length !== 0) {
      return parseInt(maxHeight.replace(/\D/g, ''));
    }

    return DEFAULT_MAX_HEIGHT;
  }

  private setDropdownPositionFixed() {
    this.dropdown.style.width = `${this.dropdown.getBoundingClientRect().width}px`;
    this.dropdown.style.left = `${this.element.getBoundingClientRect().left}px`;
    this.dropdown.style.position = 'fixed';
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
    const maxDropdownHeight = this.getMaxDropdownHeight(spaceAbove - EXTRA_SPACING);

    const pixelsFromDocumentBodyBottomToParentBottom = document.body.clientHeight - this.getViewBottomPosition();
    const pixelsFromParentBottomToElementTopPosition = this.getViewBottomPosition() - this.element.getBoundingClientRect().top;

    // + 1 så att focue outlines forfarande syns
    const dropdownBottomPosition = pixelsFromDocumentBodyBottomToParentBottom + pixelsFromParentBottomToElementTopPosition + 1;

    // Sätter bottom position så att dropdownen kan växa och minska med height uppåt
    this.dropdown.style.bottom = `${dropdownBottomPosition}px`;
    this.dropdown.style.maxHeight = `${maxDropdownHeight}px`;
    this.dropdown.style.top = `inherit`;

    this.dropdownMovedUp.emit(true);
  }

  private setDropdownBelow(spaceBelow: number) {
    const maxDropdownHeight = this.getMaxDropdownHeight(spaceBelow - EXTRA_SPACING);
    const dropdownTopPosition = this.element.getBoundingClientRect().bottom;

    // Sätter top positionen så att dropdownen kan växa och minska med height nedåt
    this.dropdown.style.top = `${dropdownTopPosition}px`;
    this.dropdown.style.maxHeight = `${maxDropdownHeight}px`;
    this.dropdown.style.bottom = `inherit`;

    this.dropdownMovedUp.emit(false);
  }

  private getMaxDropdownHeight(availableSpace: number) {
    return Math.min(availableSpace, this.preferredHeight);
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
