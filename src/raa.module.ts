import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

// Components
import { RaaSelect } from './components/raa-select/raa-select.component';
import { RaaModalPageComponent } from './components/raa-modal-page/raa-modal-page.component';
import { RaaDialogueComponent } from './components/raa-dialogue/raa-dialogue.component';
import { RaaLabel } from './components/raa-label/raa-label.component';
import { RaaTextWithSpinner } from './components/raa-text-with-spinner/raa-text-with-spinner.component';
import { RaaSpinnerComponent } from './components/raa-spinner/raa-spinner.component';

// Directives
import { OutsideClickDirective } from './directives/raa-outside-click.directive';
import { RaaRequestFocusDirective } from './directives/raa-request-focus.directive';
import { RaaSelectAllOnFocus } from './directives/raa-select-all-on-focus.directive';

// Pipes
import { OrgnummerPipe } from './pipes/orgnummer.pipe';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
    ],
    declarations: [
      RaaSelect,
      OutsideClickDirective,
      RaaRequestFocusDirective,
      RaaSelectAllOnFocus,
      RaaModalPageComponent,
      RaaDialogueComponent,
      RaaLabel,
      RaaTextWithSpinner,
      RaaSpinnerComponent,
      OrgnummerPipe
    ],
    exports: [
        RaaSelect,
        RaaLabel,
        RaaTextWithSpinner,
        RaaSpinnerComponent,
        RaaModalPageComponent,
        RaaDialogueComponent,
        OutsideClickDirective,
        RaaRequestFocusDirective,
        CommonModule,
        FormsModule,
        OrgnummerPipe,
    ],
    providers: [
      OrgnummerPipe
    ]
})
export class RaaModule {
  constructor() {}
}
