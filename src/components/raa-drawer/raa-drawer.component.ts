import {
  Component,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  TemplateRef,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';

export type DrawerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'fullscreen';
export type DrawerState = 'open' | 'closed' | 'minimized';
export type DrawerPosition = 'left' | 'right';
export type DrawerWindowMode = 'desktop' | 'mobile';

export const DRAWER_OPEN: DrawerState = 'open';
export const DRAWER_CLOSED: DrawerState = 'closed';
export const DRAWER_MINIMIZED: DrawerState = 'minimized';
export const DRAWER_DESKTOP: DrawerWindowMode = 'desktop';
export const DRAWER_MOBILE: DrawerWindowMode = 'mobile';

export const MOBILE_WINDOW_WIDTH_LIMIT = 570;

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
          transform: '{{translate}}',
        }),
        { params: { translate: 'translateY(100%)' } }
      ),
      state(
        DRAWER_MINIMIZED,
        style({
          transform: '{{translate}}',
        }),
        { params: { translate: 'translateY(100%)' } }
      ),
      transition(`${DRAWER_OPEN} => ${DRAWER_CLOSED}`, [
        group([query('@fadeContent', animateChild()), animate('250ms ease-in')]),
      ]),
      transition(`${DRAWER_CLOSED} => ${DRAWER_OPEN}`, [
        group([query('@fadeContent', animateChild()), animate('250ms ease-in')]),
      ]),
      transition(`${DRAWER_OPEN} => ${DRAWER_MINIMIZED}`, [
        group([query('@fadeContent', animateChild()), animate('250ms ease-in')]),
      ]),
      transition(`${DRAWER_MINIMIZED} => ${DRAWER_OPEN}`, [
        group([query('@fadeContent', animateChild()), animate('250ms ease-in')]),
      ]),
    ]),
    trigger('fadeContent', [
      state(
        DRAWER_OPEN,
        style({
          opacity: 1,
        })
      ),
      state(
        DRAWER_CLOSED,
        style({
          opacity: 1,
        })
      ),
      state(
        DRAWER_MINIMIZED,
        style({
          opacity: 0,
        })
      ),
      transition(`${DRAWER_OPEN} => ${DRAWER_MINIMIZED}`, animate(250, style({ opacity: 0 }))),
      transition(`${DRAWER_OPEN} => ${DRAWER_CLOSED}`, animate(250, style({ opacity: 1 }))),
      transition(`${DRAWER_MINIMIZED} => ${DRAWER_OPEN}`, animate(250, style({ opacity: 1 }))),
    ]),
  ],
})
export class RaaDrawerComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe: Subject<void> = new Subject();

  @Input() drawerSize: DrawerSize = 'small';
  @Input() drawerState: DrawerState = DRAWER_OPEN;
  @Input() position: DrawerPosition = 'left';
  @Input() closedDrawerTemplate: TemplateRef<any>;
  @Input() hideTopButtons = false;
  @Input() hideLeftButton = false;
  @Input() hideCenterButton = false;
  @Input() hideRightButton = false;
  @Input() hideOnLargeScreen = false;
  @Input() handleIsVisible = true;
  @Input() drawerInvisible = false;

  @Input() leftButtonText = '';
  @Input() centerButtonText = '';
  @Input() rightButtonText = '';

  @Output() drawerStateChange = new EventEmitter<DrawerState>();
  @Output() drawerWindowMode = new EventEmitter<DrawerWindowMode>();
  @Output() leftButtonClicked = new EventEmitter<void>();
  @Output() rightButtonClicked = new EventEmitter<void>();
  @Output() animationDoneEmitter = new EventEmitter<ClientRect>();

  @ViewChild('drawer') drawer: ElementRef;

  animationInProgress = false;
  translateAnimation = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT) {
      this.drawerWindowMode.emit(DRAWER_MOBILE);
      this.setAnimation({ direction: 'Y', percent: 100 });
    } else {
      this.drawerWindowMode.emit(DRAWER_DESKTOP);
      this.setAnimation();
    }
  }

  ngOnInit() {
    if (window.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT) {
      this.setAnimation({ direction: 'Y', percent: 100 });
      this.drawerWindowMode.emit(DRAWER_MOBILE);
    } else {
      this.setAnimation();
      this.drawerWindowMode.emit(DRAWER_DESKTOP);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.drawerState?.currentValue === DRAWER_CLOSED) {
      this.close();
    }
  }

  toggleDrawer() {
    if (window.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT) {
      this.setAnimation({
        direction: 'Y',
        percent: 90,
      });
    } else {
      this.setAnimation();
    }

    this.drawerState = this.drawerState === DRAWER_OPEN ? DRAWER_MINIMIZED : DRAWER_OPEN;
    this.drawerStateChange.emit(this.drawerState);
  }

  isDrawerOpen() {
    return this.drawerState === DRAWER_OPEN;
  }

  animationDone() {
    this.animationInProgress = false;
    this.animationDoneEmitter.emit(this.drawer.nativeElement.getBoundingClientRect());
  }

  private close() {
    if (window.innerWidth <= MOBILE_WINDOW_WIDTH_LIMIT) {
      this.setAnimation({
        direction: 'Y',
        percent: 100,
      });
    } else {
      this.setAnimation();
    }
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
