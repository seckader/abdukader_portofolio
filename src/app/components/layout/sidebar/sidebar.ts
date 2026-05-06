import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, take, takeUntil } from 'rxjs';
import { AnimationService } from '../../../services/animation';
import { AppStateService } from '../../../services/app-state';
import { ScrollSpyService } from '../../../services/scroll-spy';
import { NavComponent } from './nav/nav';
import { SocialLinksComponent } from './social-links/social-links';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  activeSection = 'about';
  currentLang = 'fr';

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  @ViewChildren('sidebarIntro') sidebarIntroRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild(NavComponent) navComponent?: NavComponent;
  @ViewChildren(SocialLinksComponent) socialComponents!: QueryList<SocialLinksComponent>;

  constructor(
    private animationService: AnimationService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private scrollSpyService: ScrollSpyService,
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.currentLang = this.translateService.currentLang || this.translateService.getFallbackLang() || 'fr';

    this.scrollSpyService.activeSection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sectionId => {
        this.activeSection = sectionId;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Classic GSAP entrance, intentionally triggered by the preloader completion event rather than ScrollTrigger.
    this.appStateService.preloaderComplete$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => this.animateSidebar());
  }

  switchLanguage(): void {
    const nextLang = this.currentLang === 'fr' ? 'en' : 'fr';
    this.currentLang = nextLang;
    this.translateService.use(nextLang);

    if (this.isBrowser) {
      localStorage.setItem('lang', nextLang);
      setTimeout(() => this.animationService.refreshScrollTriggers(), 0);
    }

    this.cdr.markForCheck();
  }

  private animateSidebar(): void {
    const introEls = this.sidebarIntroRefs.map(ref => ref.nativeElement);
    const navEls = this.navComponent?.getLinkElements() ?? [];
    const socialEls = this.socialComponents
      .toArray()
      .flatMap((component: SocialLinksComponent) => component.getLinkElements());

    this.animationService.animateSidebarIn(introEls, navEls, socialEls);
  }
}
