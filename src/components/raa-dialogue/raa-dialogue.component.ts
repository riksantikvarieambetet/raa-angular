import { Component, OnInit, Input} from "@angular/core";

@Component({
    selector: "raa-dialogue",
    templateUrl: "./raa-dialogue.component.html",
    styleUrls: ["./raa-dialogue.component.scss"]
})
export class RaaDialogueComponent implements OnInit{

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

    constructor() {}

    ngOnInit(): void {

        if (!this.displayDialogue) {
            throw 'ERROR: raa-select.component -> displayDialogue must be specified';
        }
 
    }

}

