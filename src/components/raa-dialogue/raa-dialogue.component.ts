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
    message: string;

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
 
    }

}

