import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AnimationService } from './services/animation';
import { AppStateService } from './services/app-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {

  showPreloader = true;

  @ViewChild('appContent') appContentRef!: ElementRef<HTMLElement>;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private translateService: TranslateService, 
    private appStateService: AppStateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object) {
      this.isBrowser = isPlatformBrowser(platformId);
    }
  
  ngOnInit(): void {
    this.initLang();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (!this.appContentRef?.nativeElement || this.showPreloader) return;

        if (event instanceof NavigationStart) {
          this.animationService.animateRouteOut(this.appContentRef.nativeElement);
        }

        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.animationService.animateRouteIn(this.appContentRef.nativeElement);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPreloadComplete(): void {
    this.showPreloader = false;
    this.changeDetectorRef.markForCheck();
    
    setTimeout(() => this.appStateService.notifyPreloaderComplete(), 0);
  }
  
  private initLang(): void {
    let savedLang: string | null = null;

    if (this.isBrowser) {
      savedLang = localStorage.getItem('lang');
    }

    const browserLang = this.translateService.getBrowserLang();
    const defaultLang = savedLang || (browserLang?.match(/fr|en/) ? browserLang : 'fr');

    this.translateService.addLangs(['fr', 'en']);
    this.translateService.setFallbackLang('fr');
    this.translateService.use(defaultLang);
  }
  
}
