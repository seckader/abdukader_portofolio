import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, QueryList, signal, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnimationService } from './services/animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {

  showPreloader = true;

  @ViewChildren('pageEntry') pageEntryEls!: QueryList<ElementRef>;

  constructor(
    private translateService: TranslateService, 
    private animationService: AnimationService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit(): void {
    this.initLang();
  }

  onPreloadComplete(): void {
    this.showPreloader = false;
    this.changeDetectorRef.markForCheck();
    
    setTimeout(() => this.animatePageEntrance(), 0);
  }

  private animatePageEntrance(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const elements = this.pageEntryEls
      .toArray()
      .map(ref => ref.nativeElement as Element);

    if (!elements.length) return;

    this.animationService.animatePageIn(elements);
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
