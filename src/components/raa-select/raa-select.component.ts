import {
  Component,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  forwardRef,
  EventEmitter,
  HostListener,
  HostBinding,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const enum KeyCode {
  Tab = 9,
  Shift = 16,
  Ctrl = 17,
  Alt = 18,
  Return = 13,
  Escape = 27,
  ArrowUp = 38,
  ArrowDown = 40
}

const ignoreOpenOnKeyCodes: { [key: number]: boolean; }
  = {
    [KeyCode.Alt]: true,
    [KeyCode.Ctrl]: true,
    [KeyCode.Shift]: true
  };

@Component({
  selector: 'raa-select',
  templateUrl: './raa-select.component.html',
  styleUrls: ['./raa-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RaaSelect),
      multi: true
    }
  ]
})
export class RaaSelect implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor {

  @HostBinding() tabindex = 0;

  @HostListener('focus', ['$event.target'])
  onFocus(_event?: FocusEvent) {
    if (!this.showDropdown) {
      this.setFocusToInputField.emit();
      this.focusGained();
    }
  }

  @Input() domain: any[];
  @Input() disabled: boolean;
  @Input() valueAttr: string;
  @Input() displayAttr: string;
  @Input() placeholder: string;

  @Output() onSelect = new EventEmitter<any>();

  @ViewChild('inputField')
  inputField: ElementRef;

  @ViewChild('dropdown')
  dropdown: ElementRef;

  @ViewChildren('dropdownItem')
  dropdownItems: QueryList<ElementRef>;


  value: any;
  filterInput = '';
  showDropdown = false;
  hoverIndex = 0;
  dropdownIsAbove = false;

  domainValues: DomainValue[] = [];
  filteredDomainValues: DomainValue[] = [];

  setFocusToInputField = new EventEmitter();

  scrollToSelected = false;

  constructor() {
  }

  // Handling of ngModel
  writeValue(value: any) {
    if (value) {
      this.filterInput = this.getDisplayValue(value);
    }

    this.value = value;
  }

  propagateChange = (_: any) => {
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }

  ngOnInit() {
    if (!this.domain) {
      throw 'ERROR: raa-select.component -> domain must be specified';
    }

    if (!this.valueAttr) {
      throw 'ERROR: raa-select.component -> valueAttr must be specified';
    }

    if (!this.displayAttr) {
      throw 'ERROR: raa-select.component -> displayAttr must be specified';
    }


    this.showDropdown = false;
    this.filterInput = '';
    this.domainValues = this.mapDomainValues();
    this.filterValues();
  }

  ngAfterViewInit() {
    this.dropdownItems.changes.subscribe(() => this.handleDropdownItemsChanged());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.domain) {
      this.domainValues = this.mapDomainValues();
      this.filterValues();

      setTimeout(() => this.focusLost());
    }
  }

  handleDropdownItemsChanged() {
    if (this.scrollToSelected) {
      this.scrollToSelected = false;

      const selectedEl = this.findSelectedDropdownItem();

      if (selectedEl) {
        this.scrollToDropdownItem(selectedEl);
      }
    }
  }

  findSelectedDropdownItem(): HTMLElement | undefined {
    return this.dropdownItems
      .map(elRef => elRef.nativeElement as HTMLElement)
      .filter(el => el.classList.contains('selected'))[0];
  }

  scrollToDropdownItem(dropdownItem: HTMLElement) {
    const dropdownEl = this.dropdown.nativeElement as HTMLElement;
    dropdownEl.scrollTop = dropdownItem.offsetTop;
  }

  onFilterdInputChange() {
    this.filterValues();
  }

  openDropdownIfClosed() {
    if (!this.showDropdown) {
      this.clearFilters();
      this.setHoverIndexFromSelectedValue();
      this.scrollToSelected = true;
      this.selectAllTextInInput();

      return this.showDropdown = true;
    }

    return false;
  }

  dropdownMovedUp(event: boolean) {
    this.dropdownIsAbove = event;
  }

  select(item: DomainValue) {
    if (typeof item !== 'undefined') {
      this.value = item.id;
      this.filterInput = item.displayValue;

      this.propagateChange(this.value);
      this.onSelect.emit(this.value);
    }

    this.focusLost();
    this.setFocusToInputField.emit();
  }

  clearSelection() {
    this.value = undefined;
    this.filterInput = '';
    this.propagateChange(this.value);
  }

  mapDomainValues() {
    return this.domain.map(item => {
      return {
        id: item[this.valueAttr],
        displayValue: item[this.displayAttr]
      };
    });
  }

  filterValues() {
    if (typeof this.filterInput === 'undefined' || this.filterInput.length === 0) {
      this.filteredDomainValues = this.domainValues.slice();
      return;
    }

    this.filteredDomainValues = this.domainValues.filter(item => item.displayValue.toLowerCase().indexOf(this.filterInput.toLocaleLowerCase()) > -1);
    if (this.filteredDomainValues.length > 0) {
      this.hoverIndex = 0;
    }
  }

  clearFilters() {
    this.filteredDomainValues = this.domainValues.slice();
  }

  getValue(item: any) {
    return item[this.valueAttr];
  }

  getDisplayValue = (itemKey: any): string => {
    if (typeof itemKey === 'undefined' || itemKey.length < 1 || this.domainValues.length === 0) {
      return '';
    }
    let domainObject = this.domainValues.filter(domainItem => domainItem.id === itemKey);
    if (domainObject.length === 0) {
      throw 'ERROR: raa-select.component -> There is no domain object with key ' + itemKey + '. Make sure the key exists in domain and/or the type (string/number) is correct';
    }

    return domainObject[0].displayValue;
  }

  handleKeyPressed(event: KeyboardEvent) {
    const keyCode = event.which;

    if (keyCode === KeyCode.ArrowDown) {
      event.preventDefault();

      if (this.openDropdownIfClosed()) {
        return;
      }

      if (this.hoverIndex < this.filteredDomainValues.length - 1) {
        this.hoverIndex += 1;
      }
    }
    else if (keyCode === KeyCode.ArrowUp) {
      event.preventDefault();

      if (this.openDropdownIfClosed()) {
        return;
      }

      if (this.hoverIndex > 0) {
        this.hoverIndex -= 1;
      }
    }
    else if (keyCode === KeyCode.Return) {
      if (this.hoverIndex > -1) {
        event.preventDefault();
        this.select(this.filteredDomainValues[this.hoverIndex]);
        this.focusLost();
      }
    }
    else if (keyCode === KeyCode.Escape) {
      event.preventDefault();
      this.focusLost();
    }
    else if (keyCode === KeyCode.Tab) {
      this.focusLost();
    }
    else {
      if (!ignoreOpenOnKeyCodes[keyCode]) {
        this.openDropdownIfClosed();
      }
    }
  }

  toggleDropdown() {
    if (!this.showDropdown) {
      this.onFocus();
      this.openDropdownIfClosed();
    }
    else {
      this.focusLost();
    }
  }

  setHoverIndexFromSelectedValue() {
    if (this.value) {
      this.filteredDomainValues.forEach((item, index) => {
        if (item.id === this.value) {
          this.hoverIndex = index;
        }
      });
    }
  }

  focusGained() {
    // this.openDropdownIfClosed();
    this.clearFilters();
  }

  focusLost = () => {
    this.showDropdown = false;
    // this.clearDisplayTextWhenEmptyModel();

    // sätter visningsvärde till valt värde, detta om användaren börjar justera men avbryter
    this.filterInput = this.getDisplayValue(this.value);
    this.hoverIndex = -1;
    this.tabindex = -1;
  }

  // clearDisplayTextWhenEmptyModel() {
  //   if (!this.value) {
  //     this.filterInput = '';
  //   }
  // }


  private selectAllTextInInput() {
    this.inputField.nativeElement.select();
  }
}

export type DomainValue = { id: any; displayValue: string };