import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { RaaSelectComponent } from './components/raa-select/raa-select.component';
import { RaaDropdownComponent } from './components/raa-dropdown/raa-dropdown.component';
import { RaaModalPageComponent } from './components/raa-modal-page/raa-modal-page.component';
import { RaaDialogComponent } from './components/raa-dialog/raa-dialog.component';
import { RaaTextWithSpinnerComponent } from './components/raa-text-with-spinner/raa-text-with-spinner.component';
import { RaaLabelComponent } from './components/raa-label/raa-label.component';
import { RaaSpinnerComponent } from './components/raa-spinner/raa-spinner.component';
import { RaaOverlaySpinnerComponent } from './components/raa-overlay-spinner/raa-overlay-spinner.component';
import { RaaNavigationBarComponent } from './components/raa-navigation-bar/raa-navigation-bar.component';
import { RaaBottomDialogComponent } from './components/raa-bottom-dialog/raa-bottom-dialog.component';
import { RaaAutocompleteComponent } from './components/raa-autocomplete/raa-autocomplete.component';
import { RaaDrawerComponent } from './components/raa-drawer/raa-drawer.component';
import { RaaCookiesComponent } from './components/raa-cookies/raa-cookies.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

// Directives
import { OutsideClickDirective } from './directives/raa-outside-click.directive';
import { RaaRequestFocusDirective } from './directives/raa-request-focus.directive';
import { RaaSelectAllOnFocusDirective } from './directives/raa-select-all-on-focus.directive';
import { RaaFocusInvalidElementDirective } from './directives/raa-focus-invalid-element.directive';
import { RaaTrapFocusDirective } from './directives/raa-trap-focus.directive';

// Pipes
import { OrgnummerPipe } from './pipes/orgnummer.pipe';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    A11yModule,
    MatSlideToggleModule,
    MatExpansionModule,
  ],
  declarations: [
    RaaSelectComponent,
    RaaDropdownComponent,
    OutsideClickDirective,
    RaaRequestFocusDirective,
    RaaSelectAllOnFocusDirective,
    RaaFocusInvalidElementDirective,
    RaaTrapFocusDirective,
    RaaModalPageComponent,
    RaaDialogComponent,
    RaaTextWithSpinnerComponent,
    RaaLabelComponent,
    RaaSpinnerComponent,
    RaaOverlaySpinnerComponent,
    OrgnummerPipe,
    RaaNavigationBarComponent,
    RaaBottomDialogComponent,
    RaaAutocompleteComponent,
    RaaDrawerComponent,
    RaaCookiesComponent,
  ],
  exports: [
    RaaSelectComponent,
    RaaDropdownComponent,
    RaaTextWithSpinnerComponent,
    RaaLabelComponent,
    RaaSpinnerComponent,
    RaaOverlaySpinnerComponent,
    RaaModalPageComponent,
    RaaDialogComponent,
    OutsideClickDirective,
    RaaRequestFocusDirective,
    RaaSelectAllOnFocusDirective,
    RaaFocusInvalidElementDirective,
    OrgnummerPipe,
    RaaTrapFocusDirective,
    RaaNavigationBarComponent,
    RaaBottomDialogComponent,
    RaaAutocompleteComponent,
    RaaDrawerComponent,
    RaaCookiesComponent,
    MatSlideToggleModule,
    MatExpansionModule,
  ],
  providers: [OrgnummerPipe],
})
export class RaaModule {}
