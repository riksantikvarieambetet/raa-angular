import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'raa-dialogue',
    templateUrl: './raa-dialogue.component.html',
    styleUrls: ['./raa-dialogue.component.scss']
})
export class RaaDialogueComponent implements OnInit {

    @Input()
    displayDialogue: boolean;

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

    constructor() { }

    ngOnInit(): void {
         if (!this.header) {
            throw 'ERROR: raa-dialogue.component -> header must be specified (string)';
        }
    }

}

