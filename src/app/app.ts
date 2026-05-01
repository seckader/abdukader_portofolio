import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from './services/app-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {

  showPreloader = true;

  constructor(
    private translateService: TranslateService, 
    private appStateService: AppStateService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit(): void {
    this.initLang();
  }

  onPreloadComplete(): void {
    this.showPreloader = false;
    this.changeDetectorRef.markForCheck();
    
    setTimeout(() => this.appStateService.notifyPreloaderComplete(), 0);
  }
  
  private initLang(): void {
    let savedLang: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      savedLang = localStorage.getItem('lang');
    }

    const browserLang = this.translateService.getBrowserLang();
    const defaultLang = savedLang || (browserLang?.match(/fr|en/) ? browserLang : 'fr');

    this.translateService.addLangs(['fr', 'en']);
    this.translateService.setFallbackLang('fr');
    this.translateService.use(defaultLang);
  }
  
}
