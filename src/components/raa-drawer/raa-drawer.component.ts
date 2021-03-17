import { Component, Input, OnDestroy, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';

export type DrawerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'fullscreen';
export type DrawerState = 'open' | 'closed';
export type DrawerPosition = 'left' | 'right';
const DRAWER_OPEN: DrawerState = 'open';
const DRAWER_CLOSED: DrawerState = 'closed';
export const MOBILE_WINDOW_WIDTH_LIMIT = 520;
export const MEDIUM_WINDOW_WIDTH_LIMIT = 570;

@Component({
  selector: 'raa-drawer',
  templateUrl: './raa-drawer.component.html',
  styleUrls: ['./raa-drawer.component.scss'],
  animations: [
    trigger('drawerState', [
      state(
        DRAWER_OPEN,
        style({
          transform: 'none',
        })
      ),
      state(
        DRAWER_CLOSED,
        style({
          transform: '{{translateY}}',
        }),
        { params: { translateY: 'translateY(-100%)' } }
      ),
      transition(`${DRAWER_OPEN} => ${DRAWER_CLOSED}`, animate('250ms ease-in')),
      transition(`${DRAWER_CLOSED} => ${DRAWER_OPEN}`, animate('250ms ease-out')),
    ]),
  ],
})
export class RaaDrawerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject();

  @Input() drawerSize: DrawerSize = 'small';
  @Input() positionTop = 0;
  @Input() drawerState: DrawerState = DRAWER_OPEN;
  @Input() position: DrawerPosition = 'left';
  @Input() hasTopNavigation = true;
  @Input() closedDrawerText = 'Stängd drawer-text';

  @Input() hideTopButtons = false;
  @Input() hideLeftButton = false;
  @Input() hideMiddleButton = false;
  @Input() hideRightButton = false;
  @Input() hideOnLargeScreen = false;

  @Input() handleIsVisible = true;

  @Input() leftButtonText = '';
  @Input() middleButtonText = '';
  @Input() rightButtonText = '';
  @Input() closedDrawerLeftButtonText = 'Rensa';

  @Output() drawerStateChange = new EventEmitter<DrawerState>();

  @Output() leftButtonClicked = new EventEmitter<void>();
  @Output() middleButtonClicked = new EventEmitter<void>();
  @Output() rightButtonClicked = new EventEmitter<void>();

  animationDone = false;
  translateAnimation = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT) {
      this.setAnimation({ direction: 'Y', percent: 100 });
    } else {
      this.setAnimation();
    }
  }

  ngOnInit() {
    if (window.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT) {
      this.setAnimation({ direction: 'Y', percent: 100 });
    } else {
      this.setAnimation({ direction: 'X', percent: this.position === 'left' ? -100 : 100 });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleDrawer() {
    if (window.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT) {
      this.setAnimation({
        direction: 'Y',
        percent: 90,
      });
    } else {
      this.setAnimation({
        direction: 'X',
        percent: -100,
      });
    }

    this.drawerState = this.drawerState === DRAWER_OPEN ? DRAWER_CLOSED : DRAWER_OPEN;
    this.drawerStateChange.emit(this.drawerState);
    this.middleButtonClicked.emit();
  }

  isDrawerOpen() {
    return this.drawerState === DRAWER_OPEN;
  }

  close() {
    if (window.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT) {
      this.setAnimation({
        direction: 'Y',
        percent: 100,
      });
    } else {
      this.setAnimation({
        direction: 'X',
        percent: -100,
      });
    }

    this.drawerState = DRAWER_CLOSED;
    this.rightButtonClicked.emit();
  }

  private setAnimation(overrideAnimation?: { direction: 'X' | 'Y'; percent: number }) {
    if (overrideAnimation) {
      this.translateAnimation = `translate${overrideAnimation.direction}(${overrideAnimation.percent}%)`;
      return;
    }

    if (window.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT) {
      this.translateAnimation = `translateY(100%)`;
    } else {
      this.translateAnimation = `translateX(${this.position === 'left' ? -100 : 100}%)`;
    }
  }
}
