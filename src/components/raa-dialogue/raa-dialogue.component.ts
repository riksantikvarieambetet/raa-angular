import { Component, Input } from '@angular/core';

@Component({
    selector: 'raa-dialogue',
    templateUrl: './raa-dialogue.component.html',
    styleUrls: ['./raa-dialogue.component.scss']
})
export class RaaDialogueComponent {

  @Input()
  onYes: Function;

  @Input()
  onNo: Function;

  @Input()
  onOk: Function;

  @Input()
  onCancel: Function;

  @Input()
  onClose: Function;

  @Input()
  header: string;
}

