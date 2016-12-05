import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "raa-modal-page",
    templateUrl: "./raa-modal-page.component.html",
    styleUrls: ["./raa-modal-page.component.scss"]
})
export class RaaModalPageComponent implements OnInit{

    @Input()
    onClose: Function;

    ngOnInit(){

        if (!this.onClose) {
            throw 'ERROR: raa-select.component -> onClose must be specified (function)';
        }

    }

}

