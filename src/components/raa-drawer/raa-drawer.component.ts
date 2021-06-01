import {
  Component,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  HostListener,
  TemplateRef,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';

export type DrawerEventType = 'resize' | 'animation_done';
export type DrawerPosition = 'left' | 'right';
export type DrawerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'fullscreen';
export type DrawerState = 'open' | 'closed' | 'minimized';
export type DrawerWindowMode = 'desktop' | 'mobile';

export const DRAWER_ANIMATION_DONE_EVENT: DrawerEventType = 'animation_done';
export const DRAWER_RESIZE_EVENT: DrawerEventType = 'resize';
export const DRAWER_CLOSED: DrawerState = 'closed';
export const DRAWER_MINIMIZED: DrawerState = 'minimized';
export const DRAWER_OPEN: DrawerState = 'open';
export const DRAWER_DESKTOP: DrawerWindowMode = 'desktop';
export const DRAWER_MOBILE: DrawerWindowMode = 'mobile';

export interface DrawerEvent {
  type: DrawerEventType;
  mode: DrawerWindowMode;
  rect: ClientRect;
}

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
export class RaaDrawerComponent implements OnDestroy, OnChanges, OnInit {
  private ngUnsubscribe: Subject<void> = new Subject();

  @Input() drawerSize: DrawerSize = 'small';
  @Input() drawerState: DrawerState = DRAWER_OPEN;
  @Input() position: DrawerPosition = 'left';
  @Input() minimizedMobileTemplate: TemplateRef<any>;
  @Input() handleIsVisible = true;
  @Input() drawerInvisible = false;

  @Output() drawerStateChange = new EventEmitter<DrawerState>();
  @Output() drawerEventEmitter = new EventEmitter<DrawerEvent>();
  @Output() leftButtonClicked = new EventEmitter<void>();
  @Output() rightButtonClicked = new EventEmitter<void>();

  @ViewChild('drawer') drawer: ElementRef;

  drawerWindowMode: DrawerWindowMode;
  animationInProgress = false;
  translateAnimation = '';

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.drawerWindowMode = window.innerWidth < MOBILE_WINDOW_WIDTH_LIMIT ? DRAWER_MOBILE : DRAWER_DESKTOP;
    this.setAnimation();
    this.emitDrawerEvent(DRAWER_RESIZE_EVENT);
  }

  ngOnInit() {
    this.drawerWindowMode = window.innerWidth < MOBILE_WINDOW_WIDTH_LIMIT ? DRAWER_MOBILE : DRAWER_DESKTOP;
    this.setAnimation();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.drawerState?.currentValue) {
      this.setAnimation();
    }
  }

  toggleDrawer() {
    this.drawerState = this.drawerState === DRAWER_OPEN ? DRAWER_MINIMIZED : DRAWER_OPEN;
    this.drawerStateChange.emit(this.drawerState);
    this.setAnimation();
  }

  isDrawerOpen() {
    return this.drawerState === DRAWER_OPEN;
  }

  emitDrawerEvent(type: DrawerEventType) {
    setTimeout(() => {
      this.drawerEventEmitter.emit({
        type,
        mode: this.drawerWindowMode,
        rect: this.drawer.nativeElement.getBoundingClientRect(),
      });
    });
  }

  private setAnimation() {
    if (this.drawerWindowMode === DRAWER_MOBILE && this.drawerState !== DRAWER_CLOSED) {
      this.translateAnimation = `translateY(90%)`;
    } else if (this.drawerWindowMode === DRAWER_MOBILE && this.drawerState === DRAWER_CLOSED) {
      this.translateAnimation = `translateY(100%)`;
    } else {
      this.translateAnimation = `translateX(${this.position === 'left' ? -100 : 100}%)`;
    }
  }
}
