import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AnimationService } from '../../services/animation';
import { AppStateService } from '../../services/app-state';
import { SeoService, BASE_URL } from '../../services/seo.service';
import { ScrollSpyService } from '../../services/scroll-spy';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidebarEntry') sidebarEntryRef!: ElementRef<HTMLElement>;
  @ViewChildren('sectionEntry') sectionEntryRefs!: QueryList<ElementRef<HTMLElement>>;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private appStateService: AppStateService,
    private seoService: SeoService,
    private scrollSpyService: ScrollSpyService,
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.setMeta();

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((_event: LangChangeEvent) => this.setMeta());
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const sections = this.sectionEntryRefs.map(ref => ref.nativeElement);
    this.scrollSpyService.observeSections(sections);

    this.appStateService.preloaderComplete$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.animateEntrance());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.scrollSpyService.disconnect();
  }

  private animateEntrance(): void {
    const sidebar = this.sidebarEntryRef.nativeElement;
    const sections = this.sectionEntryRefs.map(ref => ref.nativeElement);

    this.animationService.animateLayoutIn(sidebar, sections);
  }

  private setMeta(): void {
    const lang = this.seoService.getActiveLang();
    const title = lang === 'en'
      ? 'Abdou Kader SECK - Fullstack Developer'
      : 'Abdou Kader SECK - Développeur Fullstack';
    const description = lang === 'en'
      ? 'Fullstack developer in Montreal, building Angular interfaces, backend APIs, cloud workflows, and pragmatic software architectures.'
      : 'Développeur Fullstack à Montréal, je conçois des interfaces Angular, des APIs backend, des workflows cloud et des architectures pragmatiques.';

    this.seoService.updateMetaTags({
      title,
      description,
      canonicalUrl: '/',
      keywords: lang === 'en'
        ? [
            'Fullstack Developer',
            'Software Developer',
            'Backend Developer',
            'Angular',
            'Spring Boot',
            'Java',
            'TypeScript',
            'REST APIs',
            'Cloud Computing',
            'DevOps',
            'Software Architecture',
            'Kafka',
            'Docker',
            'Montreal',
            'Canada'
          ]
        : [
            'Développeur Fullstack',
            'Développeur logiciel',
            'Développeur backend',
            'Angular',
            'Spring Boot',
            'Java',
            'TypeScript',
            'APIs REST',
            'Cloud computing',
            'DevOps',
            'Architecture logicielle',
            'Kafka',
            'Docker',
            'Montréal',
            'Canada'
          ],
      type: 'website',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Abdou Kader SECK',
          jobTitle: lang === 'en' ? 'Fullstack Developer' : 'Développeur Fullstack',
          url: BASE_URL,
          sameAs: [
            'https://github.com/seckader',
            'https://www.linkedin.com/in/abdukader',
            'https://x.com/Abdu_Kadeer',
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Abdou Kader SECK Portfolio',
          url: BASE_URL,
          description,
          inLanguage: lang,
        },
      ],
    });
  }
}
