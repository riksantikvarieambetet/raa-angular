import { Component, HostListener, OnInit, Input } from '@angular/core';

@Component({
  selector: 'raa-navigation-bar',
  templateUrl: './raa-navigation-bar.component.html',
  styleUrls: ['./raa-navigation-bar.component.scss']
})
export class RaaNavigationBarComponent implements OnInit {

  @Input()
  logoImageSrc: string = 'assets/images/logo/RAA_logo_farg_rgb.svg';

  @Input()
  applicationRoutes: ApplicationRoute[] = [];

  displayMenu: boolean = false;
  hasNewNotifications = false;

  menuBtn: HTMLElement | null = null;

  ngOnInit(): void {
    this.displayMenu = false;
    this.menuBtn = document.getElementById('menu-button');
  }

  @HostListener('document:click', ['$event'])
  handleChange(event: MouseEvent) {
    if (this.menuBtn && !this.menuBtn.contains(event.srcElement as Node)
      && !(this.menuBtn.contains(event.target as Element))
      && !(this.menuBtn === event.target)) {
      this.displayMenu = false;
    }
  }

  toggleMenu(): void {
    this.displayMenu = !this.displayMenu;
  }

  logIn() {
    // emit event
  }

  logOut() {
    // emit event
  }
}

export interface ApplicationRoute {
  name: string;
  link: string[];
}