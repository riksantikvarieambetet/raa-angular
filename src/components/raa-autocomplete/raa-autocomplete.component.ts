import {
  Component,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  EventEmitter,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Timeout = NodeJS.Timeout;

const ignoreOpenOnKeyCodes: { [key: string]: boolean } = {
  ['Alt']: true,
  ['Ctrl']: true,
  ['Shift']: true,
};

@Component({
  selector: 'raa-autocomplete',
  templateUrl: './raa-autocomplete.component.html',
  styleUrls: ['./raa-autocomplete.component.scss'],
})
export class RaaAutocompleteComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input()
  inputElementID: string;

  @Input()
  domain: any[] = [];

  @Input()
  initSearchString: string;

  @Input()
  noResultsFoundText = {
    text: '',
    showIfGreaterThan: 2,
  };

  @Input()
  valueAttr = '';

  @Input()
  displayAttr = '';

  @Input()
  placeholder = '';

  @Input()
  disabled = false;

  @Input()
  filterByStartsWith = false;

  @Input()
  showSpinner = false;

  @Output()
  searchQuery = new EventEmitter<string>();

  @Output()
  onSelect = new EventEmitter<any>();

  @ViewChild('inputField')
  inputField: ElementRef;

  @ViewChild('dropdown')
  dropdown: ElementRef;

  @ViewChildren('dropdownItem')
  dropdownItems: QueryList<ElementRef>;

  private ngUnsubscribe = new Subject<void>();

  value: any;
  filterInput = '';
  showDropdown = false;
  hoverIndex = 0;
  dropdownIsAbove = false;
  hoveredItem: Element;

  domainValues: DomainValue[] = [];
  filteredDomainValues: DomainValue[] = [];
  setFocusToInputField = new EventEmitter();
  scrollToSelected = false;
  timeout: Timeout;

  ngOnInit() {
    if (!this.domain) {
      throw new Error('ERROR: raa-autocomplete.component -> domain must be specified');
    }

    if (!this.valueAttr) {
      throw new Error('ERROR: raa-autocomplete.component -> valueAttr must be specified');
    }

    if (!this.displayAttr) {
      throw new Error('ERROR: raa-autocomplete.component -> displayAttr must be specified');
    }

    this.showDropdown = false;
    this.domainValues = this.mapDomainValues();
    this.filterValues();
  }

  ngAfterViewInit() {
    this.dropdownItems.changes.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.handleDropdownItemsChanged());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.domain) {
      this.domainValues = this.mapDomainValues();
      this.filterValues();
    } else if (changes.initSearchString && changes.initSearchString.currentValue !== undefined) {
      this.filterInput = changes.initSearchString.currentValue;

      if (this.filterInput) {
        this.onFilteredInputChange();
      }
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private handleDropdownItemsChanged() {
    if (this.scrollToSelected) {
      this.scrollToSelected = false;

      const selectedEl = this.findSelectedDropdownItem();

      if (selectedEl) {
        this.scrollToDropdownItem(selectedEl);
      }
    }
  }

  private findSelectedDropdownItem(): HTMLElement | undefined {
    return this.dropdownItems
      .map((elRef) => elRef.nativeElement as HTMLElement)
      .filter((el) => el.classList.contains('selected'))[0];
  }

  private scrollToDropdownItem(dropdownItem: HTMLElement) {
    const dropdownEl = this.dropdown.nativeElement as HTMLElement;
    dropdownEl.scrollTop = dropdownItem.offsetTop;
  }

  private openDropdownIfClosed() {
    if (!this.showDropdown) {
      this.clearFilters();
      this.setHoverIndexFromSelectedValue();
      this.scrollToSelected = true;
      this.selectAllTextInInput();

      return (this.showDropdown = true);
    }

    return false;
  }

  private mapDomainValues() {
    return this.domain.map((item) => {
      return {
        id: item[this.valueAttr],
        displayValue: item[this.displayAttr],
      };
    });
  }

  private filterValues() {
    this.filteredDomainValues = [];

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (typeof this.filterInput === 'undefined' || this.filterInput.length === 0 || !this.domainValues.length) {
      this.timeout = setTimeout(() => {
        if (this.filterInput.length > this.noResultsFoundText.showIfGreaterThan && !this.showSpinner) {
          this.filteredDomainValues = [{ id: 0, displayValue: this.noResultsFoundText.text }];
        }
      }, 250);

      return;
    }

    if (this.filterByStartsWith) {
      this.filteredDomainValues = this.domainValues.filter((item) =>
        item.displayValue.toLowerCase().startsWith(this.filterInput.toLocaleLowerCase())
      );
    } else {
      this.filteredDomainValues = this.domainValues.filter(
        (item) => item.displayValue.toLowerCase().indexOf(this.filterInput.toLocaleLowerCase()) > -1
      );
    }

    if (this.filteredDomainValues.length > 0) {
      this.hoverIndex = 0;
    }
  }

  private clearFilters() {
    this.filteredDomainValues = this.domainValues.slice();
  }

  private setHoverIndexFromSelectedValue() {
    if (this.value) {
      this.filteredDomainValues.forEach((item, index) => {
        if (item.id === this.value) {
          this.hoverIndex = index;
        }
      });
    }
  }

  private selectAllTextInInput() {
    this.inputField.nativeElement.select();
  }

  private scrollDropdownItemIntoView(direction: 'up' | 'down') {
    const hovered = this.dropdownItems.find((item) =>
      (item.nativeElement as HTMLElement).classList.contains('hovered')
    );

    if (hovered && hovered.nativeElement) {
      let nextElement: Element | null;

      if (direction === 'down') {
        nextElement = (hovered.nativeElement as HTMLElement).nextElementSibling;
      } else {
        nextElement = (hovered.nativeElement as HTMLElement).previousElementSibling;
      }

      if (nextElement) {
        nextElement.scrollIntoView({ block: 'end' });
      }
    }
  }

  private dispatchForCode(event: any) {
    let code = '';

    if (event.key !== undefined) {
      code = event.key;
    } else if (event.keyIdentifier !== undefined) {
      code = event.keyIdentifier;
    } else if (event.keyCode !== undefined) {
      code = event.keyCode;
    }

    return code;
  }

  onFilteredInputChange() {
    this.searchQuery.emit(this.filterInput);
    this.filterValues();

    if (!this.filterInput) {
      this.showDropdown = false;
    }
  }

  dropdownMovedUp(event: boolean) {
    this.dropdownIsAbove = event;
  }

  select(item: DomainValue) {
    if (typeof item !== 'undefined') {
      this.value = item.id;
      this.filterInput = item.displayValue;

      this.onSelect.emit(this.value);
    }

    this.focusLost();
    this.setFocusToInputField.emit();
  }

  getDisplayValue = (itemKey: any): string => {
    if (typeof itemKey === 'undefined' || itemKey === null || itemKey.length < 1 || this.domainValues.length === 0) {
      return '';
    }
    const domainObject = this.domainValues.filter((domainItem) => domainItem.id === itemKey);
    if (domainObject.length === 0) {
      throw new Error(
        'ERROR: raa-autocomplete.component -> There is no domain object with key ' +
          itemKey +
          '. Make sure the key exists in domain and/or the type (string/number) is correct'
      );
    }

    return domainObject[0].displayValue;
  };

  handleKeyPressed(event: KeyboardEvent) {
    const keyCode = this.dispatchForCode(event);
    const hoveredItem = this.dropdownItems
      .toArray()
      .find((element) => (element.nativeElement as HTMLElement).classList.contains('hovered'));

    let previousSiblingElement;
    let nextSiblingElement;

    if (hoveredItem) {
      previousSiblingElement = (hoveredItem.nativeElement as HTMLElement).previousElementSibling;
      nextSiblingElement = (hoveredItem.nativeElement as HTMLElement).nextElementSibling;
    }

    if (keyCode === 'ArrowDown') {
      event.preventDefault();

      if (this.openDropdownIfClosed()) {
        return;
      }

      if (this.hoverIndex < this.filteredDomainValues.length - 1) {
        this.hoverIndex += 1;
        this.scrollDropdownItemIntoView('down');
      }

      if (hoveredItem && nextSiblingElement) {
        this.hoveredItem = nextSiblingElement;
      }
    } else if (keyCode === 'ArrowUp') {
      event.preventDefault();

      if (this.openDropdownIfClosed()) {
        return;
      }

      if (this.hoverIndex > 0) {
        this.hoverIndex -= 1;
        this.scrollDropdownItemIntoView('up');
      }

      if (hoveredItem && previousSiblingElement) {
        this.hoveredItem = previousSiblingElement;
      }
    } else if (keyCode === 'Enter') {
      if (this.hoverIndex > -1) {
        event.preventDefault();
        this.select(this.filteredDomainValues[this.hoverIndex]);
        this.focusLost();
      }
    } else if (keyCode === 'Escape') {
      event.preventDefault();
      this.focusLost();
    } else if (keyCode === 'Tab') {
      this.focusLost();
    } else {
      if (!ignoreOpenOnKeyCodes[keyCode]) {
        this.openDropdownIfClosed();
      }
    }
  }

  focusGained() {
    if (this.filteredDomainValues.length) {
      this.openDropdownIfClosed();
    }

    this.clearFilters();
  }

  focusLost = (clearInput = true) => {
    // sätter visningsvärde till valt värde, detta om användaren börjar justera men avbryter
    if (clearInput) {
      this.domainValues = [];
      this.domain = [];
      this.filteredDomainValues = [];
      this.filterInput = this.getDisplayValue(this.value);
    }

    this.showDropdown = false;
    this.hoverIndex = -1;
  };
}

export interface DomainValue {
  id: any;
  displayValue: string;
}
