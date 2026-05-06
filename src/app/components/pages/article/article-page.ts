import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SecurityContext,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Article, LocalizedText } from '../../../models/article.model';
import { AnimationService } from '../../../services/animation';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlePageComponent implements OnInit, AfterViewInit, OnDestroy {
  article?: Article;
  relatedArticles: Article[] = [];
  safeContent?: SafeHtml;
  currentLang: 'fr' | 'en' = 'fr';
  readingProgress = 0;
  copied = false;

  @ViewChild('articleRoot') articleRootRef!: ElementRef<HTMLElement>;
  @ViewChild('articleContent') articleContentRef!: ElementRef<HTMLElement>;
  @ViewChildren('articleIntro') articleIntroRefs!: QueryList<ElementRef<HTMLElement>>;

  private destroy$ = new Subject<void>();
  private scrollListener?: () => void;
  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
    private meta: Meta,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private title: Title,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.currentLang = this.getActiveLang();

    this.route.paramMap
      .pipe(
        switchMap(params => this.blogService.getArticleBySlug(params.get('slug') || '')),
        takeUntil(this.destroy$)
      )
      .subscribe(article => {
        if (!article) {
          this.router.navigate(['/blog']);
          return;
        }

        this.article = article;
        this.updateContent();
        this.setMeta(article);

        this.blogService.getRelatedArticles(article.id, 3)
          .pipe(takeUntil(this.destroy$))
          .subscribe(related => {
            this.relatedArticles = related;
            this.cdr.markForCheck();
          });
      });

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: LangChangeEvent) => {
        this.currentLang = event.lang === 'en' ? 'en' : 'fr';
        this.updateContent();
        if (this.article) this.setMeta(this.article);
        this.cdr.markForCheck();
        setTimeout(() => this.animationService.refreshScrollTriggers(), 0);
      });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.articleRootRef?.nativeElement.focus();
    this.scrollListener = () => this.updateReadingProgress();
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    this.updateReadingProgress();

    setTimeout(() => {
      if (this.articleRootRef?.nativeElement) {
        this.animateArticle();
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.articleRootRef?.nativeElement) {
      this.animationService.killTriggersForElement(this.articleRootRef.nativeElement);
    }

    if (this.isBrowser && this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;
    this.updateReadingProgress();
  }

  text(value: LocalizedText): string {
    return value[this.currentLang];
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat(this.currentLang === 'fr' ? 'fr-CA' : 'en-CA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  }

  getShareUrl(network: 'twitter' | 'linkedin'): string {
    const url = encodeURIComponent(this.getCurrentUrl());
    const title = encodeURIComponent(this.article ? this.text(this.article.title) : '');

    if (network === 'twitter') {
      return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    }

    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  }

  copyLink(): void {
    if (!this.isBrowser || !navigator.clipboard) return;

    navigator.clipboard.writeText(this.getCurrentUrl()).then(() => {
      this.copied = true;
      this.cdr.markForCheck();
      setTimeout(() => {
        this.copied = false;
        this.cdr.markForCheck();
      }, 1800);
    });
  }

  private updateContent(): void {
    if (!this.article) return;
    const sanitizedContent = this.sanitizer.sanitize(SecurityContext.HTML, this.text(this.article.content)) || '';
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(sanitizedContent);
  }

  private updateReadingProgress(): void {
    const scrollTop = window.scrollY || this.document.documentElement.scrollTop;
    const scrollable = this.document.documentElement.scrollHeight - window.innerHeight;
    this.readingProgress = scrollable <= 0 ? 0 : Math.min(100, Math.max(0, (scrollTop / scrollable) * 100));
    this.cdr.markForCheck();
  }

  private setMeta(article: Article): void {
    const articleTitle = this.text(article.title);
    const description = this.text(article.summary);
    const pageTitle = `${articleTitle} | Blog`;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });

    if (article.coverImage) {
      this.meta.updateTag({ property: 'og:image', content: article.coverImage.src });
    }

    this.setCanonical(`/blog/${article.id}`);
  }

  private setCanonical(path: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', `https://example.com${path}`);
  }

  private getCurrentUrl(): string {
    if (!this.isBrowser) return this.article ? `https://example.com/blog/${this.article.id}` : 'https://example.com/blog';
    return window.location.href;
  }

  private getActiveLang(): 'fr' | 'en' {
    return this.translateService.currentLang === 'en' ? 'en' : 'fr';
  }

  private animateArticle(): void {
    const rootEl = this.articleRootRef?.nativeElement;
    if (!rootEl) return;

    this.animationService.animateArticleSections(
      rootEl,
      this.articleIntroRefs.map(ref => ref.nativeElement),
      this.articleContentRef?.nativeElement
    );
  }
}
