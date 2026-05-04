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
import { isPlatformBrowser } from '@angular/common';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject, take, takeUntil } from 'rxjs';
import { Article, LocalizedText } from '../../../models/article.model';
import { AnimationService } from '../../../services/animation';
import { AppStateService } from '../../../services/app-state';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BlogComponent implements OnInit, AfterViewInit, OnDestroy {
  articles: Article[] = [];
  currentLang: 'fr' | 'en' = 'fr';

  @ViewChild('blogSection') blogSectionRef!: ElementRef<HTMLElement>;
  @ViewChildren('headerItem') headerItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('blogCard') blogCardRefs!: QueryList<ElementRef<HTMLElement>>;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private appStateService: AppStateService,
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.currentLang = this.getActiveLang();

    this.blogService.getFeaturedArticles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(articles => {
        this.articles = articles;
        this.cdr.markForCheck();
      });

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: LangChangeEvent) => {
        this.currentLang = event.lang === 'en' ? 'en' : 'fr';
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.appStateService.preloaderComplete$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => this.animateSection());
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.blogSectionRef?.nativeElement) {
      this.animationService.killScrollTriggersFor([this.blogSectionRef.nativeElement]);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  text(value: LocalizedText): string {
    return value[this.currentLang];
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat(this.currentLang === 'fr' ? 'fr-CA' : 'en-CA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  private animateSection(): void {
    const headerEls = this.headerItemRefs.map(ref => ref.nativeElement);
    const cardEls = this.blogCardRefs.map(ref => ref.nativeElement);
    const triggerEl = this.blogSectionRef?.nativeElement;

    if (!triggerEl) return;

    this.animationService.animateBlogSection(headerEls, cardEls, triggerEl);
  }

  private getActiveLang(): 'fr' | 'en' {
    return this.translateService.currentLang === 'en' ? 'en' : 'fr';
  }
}
