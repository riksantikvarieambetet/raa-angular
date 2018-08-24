import { Component, HostListener, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'raa-navigation-bar',
  templateUrl: './raa-navigation-bar.component.html',
  styleUrls: ['./raa-navigation-bar.component.scss'],
})
export class RaaNavigationBarComponent implements OnInit {
  @Input()
  logoImageSrc: string = 'assets/images/logo/RAA_logo_farg_rgb.svg';

  @Input()
  applicationRoutes: ApplicationRoute[] = [];

  displayMenu: boolean = false;
  hasNewNotifications = false;

  menuBtn: HTMLElement | null = null;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.displayMenu = false;
    this.menuBtn = document.getElementById('menu-button');
  }

  @HostListener('document:click', ['$event'])
  handleChange(event: MouseEvent) {
    if (
      this.menuBtn &&
      !this.menuBtn.contains(event.srcElement as Node) &&
      !this.menuBtn.contains(event.target as Element) &&
      !(this.menuBtn === event.target)
    ) {
      this.displayMenu = false;
    }
  }

  toggleMenu() {
    this.displayMenu = !this.displayMenu;
  }

  skip(event: Event) {
    const tabbables = document.querySelectorAll('input, textarea, button, a');
    const activeElement = event.target;
    let activeElementIndex = -1;

    for (let i = 0; i < tabbables.length; i++) {
      if (activeElement === tabbables.item(i)) {
        activeElementIndex = i;
      } else if (activeElementIndex >= 0 && !this.element.nativeElement.contains(tabbables.item(i))) {
        const item = tabbables.item(i) as HTMLElement;
        item.focus();
        break;
      }
    }
  }
}

export interface ApplicationRoute {
  name: string;
  link: string[];
}
