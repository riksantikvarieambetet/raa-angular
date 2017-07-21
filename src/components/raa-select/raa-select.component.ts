import { Component, Input, OnInit, forwardRef, EventEmitter, HostListener, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


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
export class RaaSelect implements OnInit, ControlValueAccessor, OnChanges {

  @HostBinding() tabindex = 0;

  @HostListener('focus', ['$event.target'])
  onFocus() {
    this.setFocusToInputField.emit(undefined);
    this.focusGained();
  }

  @Input() domain: any[];
  @Input() disabled: boolean;
  @Input() valueAttr: string;
  @Input() displayAttr: string;
  @Input() placeholder: string;

  value: any;
  filterInput = '';
  showDropdown = false;
  componentHasFocus = false;
  hoverIndex = 0;

  domainValues: DomainValue[] = [];
  filteredDomainValues: DomainValue[] = [];

  setFocusToInputField = new EventEmitter();

  constructor() {};

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['domain']) {
        this.domainValues = this.mapDomainValues();
    }
  }

  // Handling of ngModel
  writeValue(value: any) {
    if (value) {
      this.filterInput = this.getDisplayValue(value);
    }

    this.value = value;
  }

  propagateChange = (_: any) => { };
  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() { };

  onFilterdInputChange() {
    this.filterValues();
  }

  openDropdownIfClosed() {
    this.showDropdown = true;
  }

  select(item: DomainValue) {
    if (typeof item !== 'undefined') {
      this.value = item.id;
      this.propagateChange(this.value);
      this.filterInput = item.displayValue;
    }
    this.focusLost();
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
  };

  getDisplayValue = (itemKey: any): string => {
    if (typeof itemKey === 'undefined' || itemKey.length < 1) {
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

      this.showDropdown = true;
      if (this.hoverIndex < this.filteredDomainValues.length - 1) {
        this.hoverIndex += 1;
      }
    }
    else if (keyCode === KeyCode.ArrowUp) {
      event.preventDefault();

      this.showDropdown = true;
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
      this.showDropdown = true;
    }
  }

  toggleDropdown() {
    if (!this.showDropdown) {
      this.setFocusToInputField.emit(undefined);
    }
    else {
      this.focusLost();
    }
  };

  openDropDownIfClosed() {
    if (!this.showDropdown) {
      this.showDropdown = true;
    }
  }

  focusGained() {
    this.componentHasFocus = true;
    this.showDropdown = true;
    this.clearFilters();
    if (this.value) {
      this.filteredDomainValues.forEach((item, index) => {
        if (item.id === this.value) {
          this.hoverIndex = index;
        }
      });
    }
  }

  focusLost = () => {
    this.componentHasFocus = false;
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


}

export type DomainValue = { id: any; displayValue: string };

const enum KeyCode {
  Tab = 9,
  Return = 13,
  Escape = 27,
  ArrowUp = 38,
  ArrowDown = 40
}