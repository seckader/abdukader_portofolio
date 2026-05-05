import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ScrollSpyService } from '../../../services/scroll-spy';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SidebarComponent implements OnInit, OnDestroy {
  activeSection = 'about';
  currentLang = 'fr';

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
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

  switchLanguage(): void {
    const nextLang = this.currentLang === 'fr' ? 'en' : 'fr';
    this.currentLang = nextLang;
    this.translateService.use(nextLang);

    if (this.isBrowser) {
      localStorage.setItem('lang', nextLang);
    }

    this.cdr.markForCheck();
  }
}
