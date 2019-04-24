/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaaNavigationBarComponent } from './raa-navigation-bar.component';
import { beforeEach, describe, expect, it } from '@angular/core/testing/src/testing_internal';

describe('RaaNavigationBarComponent', () => {
  let component: RaaNavigationBarComponent;
  let fixture: ComponentFixture<RaaNavigationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RaaNavigationBarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaaNavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
