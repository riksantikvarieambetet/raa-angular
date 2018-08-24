import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { RaaSelect } from './components/raa-select/raa-select.component';
import { RaaDropdownComponent } from './components/raa-dropdown/raa-dropdown.component';
import { RaaModalPageComponent } from './components/raa-modal-page/raa-modal-page.component';
import { RaaDialogComponent } from './components/raa-dialog/raa-dialog.component';
import { RaaTextWithSpinner } from './components/raa-text-with-spinner/raa-text-with-spinner.component';
import { RaaLabel } from './components/raa-label/raa-label.component';
import { RaaSpinnerComponent } from './components/raa-spinner/raa-spinner.component';
import { RaaOverlaySpinnerComponent } from './components/raa-overlay-spinner/raa-overlay-spinner.component';
import { RaaNavigationBarComponent } from './components/raa-navigation-bar/raa-navigation-bar.component';
import { RaaBottomDialogComponent } from './components/raa-bottom-dialog/raa-bottom-dialog.component';

// Directives
import { OutsideClickDirective } from './directives/raa-outside-click.directive';
import { RaaRequestFocusDirective } from './directives/raa-request-focus.directive';
import { RaaSelectAllOnFocus } from './directives/raa-select-all-on-focus.directive';
import { RaaFocusInvalidElementDirective } from './directives/raa-focus-invalid-element.directive';
import { RaaTrapFocusDirective } from './directives/raa-trap-focus.directive';

// Pipes
import { OrgnummerPipe } from './pipes/orgnummer.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, BrowserAnimationsModule],
  declarations: [
    RaaSelect,
    RaaDropdownComponent,
    OutsideClickDirective,
    RaaRequestFocusDirective,
    RaaSelectAllOnFocus,
    RaaFocusInvalidElementDirective,
    RaaTrapFocusDirective,
    RaaModalPageComponent,
    RaaDialogComponent,
    RaaTextWithSpinner,
    RaaLabel,
    RaaSpinnerComponent,
    RaaOverlaySpinnerComponent,
    OrgnummerPipe,
    RaaNavigationBarComponent,
    RaaBottomDialogComponent,
  ],
  exports: [
    RaaSelect,
    RaaDropdownComponent,
    RaaTextWithSpinner,
    RaaLabel,
    RaaSpinnerComponent,
    RaaOverlaySpinnerComponent,
    RaaModalPageComponent,
    RaaDialogComponent,
    OutsideClickDirective,
    RaaRequestFocusDirective,
    RaaSelectAllOnFocus,
    RaaFocusInvalidElementDirective,
    OrgnummerPipe,
    RaaTrapFocusDirective,
    RaaNavigationBarComponent,
    RaaBottomDialogComponent,
  ],
  providers: [OrgnummerPipe],
})
export class RaaModule {}
