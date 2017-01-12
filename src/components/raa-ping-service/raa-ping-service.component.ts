import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'raa-ping-service',
    templateUrl: './raa-ping-service.component.html',
    styleUrls: ['./raa-ping-service.component.scss']
})
export class RaaPingServiceComponent implements OnInit{

    @Input()
    pingUrl: string;
    @Input()
    timeLimit: number = 600000;

    keepAliveRunning: boolean = false;
    showDialogue: boolean = false;
    info: PingInfo;

    constructor(
        private http: Http
    ) {
        this.info = new PingInfo();
        this.info.header = 'null';
    }

    ngOnInit(): void {

        if (!this.pingUrl) {
            throw 'ERROR: raa-ping-service.component -> pingUrl must be specified (string)';
        }

        this.startKeepAlivePing();
    }

    startKeepAlivePing = () => {

        let timer = Observable.timer(this.timeLimit, this.timeLimit);

        timer.subscribe(() => {
            console.log('..sending ping');

            let ping = this.http.get(this.pingUrl)
            .map((res) => res);

            ping.subscribe(res => {

                 this.showDialogue = false;

            }, (error) => {

                this.showDialogue = true;

                if (error.status === 302 || error.status === 401 || error.status === 403) {
                    this.info = {
                        header: 'Utloggad',
                        message: 'Du är inte längre inloggad i systemet. Hämta om sidan eller tryck på länken nedanför för att logga in in igen',
                        linkText: 'Logga in'
                    };
                }
                else {
                    this.info = {
                        header: 'Ingen anslutning till tjänsten',
                        message: 'Du är inte längre ansluten till tjänsten. Kontrollera att du har internetuppkoppling, eller försök igen senare',
                        linkText: 'Hämta om sidan'
                    };
                }

                return error;
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

export class PingInfo {
    header: string;
    message: string;
    linkText?: string;
}