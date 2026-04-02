import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {

  showPreloader = true;

  constructor(private translateService: TranslateService, @Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit(): void {
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

  onPreloadComplete(): void {
    this.showPreloader = false;
    // US-08 : animatePageIn() sera appelé ici
  }
  
}
