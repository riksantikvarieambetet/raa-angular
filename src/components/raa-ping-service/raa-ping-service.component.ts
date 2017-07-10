import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'raa-ping-service',
    templateUrl: './raa-ping-service.component.html',
    styleUrls: ['./raa-ping-service.component.scss']
})
export class RaaPingServiceComponent implements OnInit {

    @Input()
    pingUrl: string;
    @Input()
    timeLimit: number = 600000;

    @Input()
    unauthorizedInfo: PingInfo = {
        header: 'Utloggad',
        message: 'Du är inte längre inloggad i systemet. Hämta om sidan eller tryck på länken nedanför för att logga in in igen',
        linkText: 'Logga in'
    };

    @Input()
    noConnectionInfo: PingInfo = {
        header: 'Ingen anslutning till tjänsten',
        message: 'Du är inte längre ansluten till tjänsten. Kontrollera att du har internetuppkoppling, eller försök igen senare',
        linkText: 'Hämta om sidan'
    };

    keepAliveRunning: boolean = false;
    showDialogue: boolean = false;
    info: PingInfo | undefined;

    constructor(
        private http: Http
    ) {}

    ngOnInit(): void {
        this.startKeepAlivePing();
    }

    startKeepAlivePing = () => {

        let timer = Observable.timer(this.timeLimit, this.timeLimit);

        timer.subscribe(() => {

            this.http.get(this.pingUrl)
            .subscribe(res => {

                 this.showDialogue = false;

            }, (error) => {

                this.showDialogue = true;

                if (error.status === 302 || error.status === 401 || error.status === 403) {
                    this.info = this.unauthorizedInfo;
                }
                else {
                    this.info = this.noConnectionInfo;
                }

            });

        });
    }

    refreshPage = () => {
        window.location.reload();
    }

    closeDialogue = () => {
        this.showDialogue = false;
    }
}

export interface PingInfo {
    header: string;
    message: string;
    linkText?: string;
}