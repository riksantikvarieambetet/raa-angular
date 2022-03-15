import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface DefaultCookieObj {
  key: string;
  status: boolean;
  title: string;
  description: string;
  expanded: boolean;
  disabled: boolean;
  visible: boolean;
}

@Component({
  selector: 'raa-cookies',
  templateUrl: './raa-cookies.component.html',
})
export class RaaCookiesComponent implements OnInit {
  @Input()
  showBottomDialog = false;

  @Input()
  showDialog = false;

  @Input()
  analytics = true;

  @Input()
  functional = true;

  @Input()
  thirdparty = true;

  @Output()
  onCookieUpdate = new EventEmitter<DefaultCookieObj[]>();

  defaultCookies: DefaultCookieObj[] = [];

  private createDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }

  ngOnInit() {
    this.defaultCookies = [
      {
        key: 'viewed_cookie_policy',
        status: false,
        title: 'viewed',
        description: 'Has viewed cookie settings',
        expanded: true,
        disabled: false,
        visible: false,
      },
      {
        key: 'cookielawinfo_checkbox_necessary',
        status: true,
        title: 'Nödvändiga',
        description:
          'Nödvändiga kakor går inte att stänga av eftersom webbplatsen inte fungerar utan dessa. Nödvändiga kakor bidrar till att Riksantikvarieämbetets tjänster är säkra och fungerar som förväntat.',
        expanded: false,
        disabled: true,
        visible: true,
      },
      {
        key: 'cookielawinfo_checkbox_analytics',
        status: false,
        title: 'Analytics',
        description:
          'Analytiska cookies används för att förstå hur besökare interagerar med webbplatsen. Dessa cookies hjälper till att ge information om mätvärden för antalet besökare, avvisningsfrekvens, trafikkälla, etc.',
        expanded: false,
        disabled: false,
        visible: this.analytics,
      },
      {
        key: 'cookielawinfo_checkbox_functional',
        status: false,
        title: 'Funktionella & Prestanda',
        description:
          'Funktionella cookies hjälper till att utföra vissa funktioner som att dela innehållet på webbplatsen på sociala medieplattformar, samla in feedback och andra tredjepartsfunktioner. Prestandacookies används för att förstå och analysera webbplatsens nyckelprestandaindex, vilket hjälper till att leverera en bättre användarupplevelse för besökarna.',
        expanded: false,
        disabled: false,
        visible: this.functional,
      },
      {
        key: 'cookielawinfo_checkbox_tredjepartscookies',
        status: false,
        title: 'Tredjepartscookies',
        description:
          'Tredjepartscookies används för att ge besökarna relevanta annonser och marknadsföringskampanjer. Dessa kakor används för Youtube, Google maps och Sketchfab data.',
        expanded: false,
        disabled: false,
        visible: this.thirdparty,
      },
    ];

    let cookieString = document.cookie;
    if (cookieString) {
      cookieString = cookieString + ';';
      const cookieValues = cookieString.split(' ');
      const cookies = cookieValues.filter((cookie) => cookie.includes('cookie'));
      cookies.map((cookie) => {
        const key = cookie.split('=')[0];
        const value = cookie.split('=')[1].slice(0, -1);
        const index = this.defaultCookies.findIndex((obj) => obj.key === key);
        this.defaultCookies[index].status = value === 'yes';
      });
    }

    if (!cookieString) {
      this.showBottomDialog = true;
    } else {
      const cookieValues = cookieString.split(' ');
      const hasViewed = cookieValues.includes('viewed_cookie_policy=yes;');
      this.showBottomDialog = !hasViewed;
    }
  }

  acceptAllCookies() {
    const date = this.createDate();

    this.defaultCookies.map((cookie: DefaultCookieObj) => {
      document.cookie = `${cookie.key}=yes; expires=${date.toUTCString()}; path=/`;
    });
    this.showBottomDialog = false;
    this.onCookieUpdate.emit(this.defaultCookies);
  }

  openSettings() {
    this.showBottomDialog = false;
    this.showDialog = true;
  }

  onCloseDialog = () => {
    const index = this.defaultCookies.findIndex((obj) => obj.key === 'viewed_cookie_policy');
    this.showDialog = false;
    if (!this.defaultCookies[index].status) this.showBottomDialog = true;
  };

  onDenyClick() {
    this.showDialog = false;
    const date = this.createDate();
    this.defaultCookies.map((cookie: DefaultCookieObj) => {
      if (cookie.visible) {
        document.cookie = `${cookie.key}=no; expires=${date.toUTCString()}; path=/`;
        const index = this.defaultCookies.findIndex((obj) => obj.key === cookie.key);
        this.defaultCookies[index].status = false;
      }
    });
    document.cookie = `cookielawinfo_checkbox_necessary=yes; expires=${date.toUTCString()}; path=/`;
    document.cookie = `viewed_cookie_policy=yes; expires=${date.toUTCString()}; path=/`;
    this.showDialog = false;
    this.onCookieUpdate.emit(this.defaultCookies);
  }

  onAcceptClick() {
    const date = this.createDate();
    date.setFullYear(date.getFullYear() + 1);
    this.defaultCookies.map((cookie: DefaultCookieObj) => {
      if (cookie.visible) {
        const value = cookie.status ? 'yes' : 'no';
        document.cookie = `${cookie.key}=${value}; expires=${date.toUTCString()}; path=/`;
      }
    });
    document.cookie = `viewed_cookie_policy=yes; expires=${date.toUTCString()}; path=/`;
    this.showDialog = false;
    this.onCookieUpdate.emit(this.defaultCookies);
  }

  updateExpanded(cookie: DefaultCookieObj) {
    const objIndex = this.defaultCookies.findIndex((obj) => obj.key === cookie.key);
    this.defaultCookies[objIndex].expanded = !this.defaultCookies[objIndex].expanded;
  }

  updateCookieStatus(cookie: DefaultCookieObj) {
    const objIndex = this.defaultCookies.findIndex((obj) => obj.key === cookie.key);
    this.defaultCookies[objIndex].status = !this.defaultCookies[objIndex].status;
  }
}
