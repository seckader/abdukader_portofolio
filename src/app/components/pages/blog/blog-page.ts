import { CommonModule, isPlatformBrowser } from '@angular/common';
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
import { RouterModule } from '@angular/router';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ArticleCategory, ArticleMeta } from '../../../models/article.model';
import { AnimationService } from '../../../services/animation';
import { BlogService } from '../../../services/blog.service';
import { SeoService } from '../../../services/seo.service';

type BlogCategoryFilter = ArticleCategory | 'all';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPageComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly categories: BlogCategoryFilter[] = ['all', 'tutorial', 'opinion', 'case-study', 'tips', 'other'];

  articles: ArticleMeta[] = [];
  filteredArticles: ArticleMeta[] = [];
  tags: string[] = [];
  selectedCategory: BlogCategoryFilter = 'all';
  selectedTags = new Set<string>();
  searchQuery = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  @ViewChild('pageRoot') pageRootRef!: ElementRef<HTMLElement>;
  @ViewChild('articleGrid') articleGridRef!: ElementRef<HTMLElement>;
  @ViewChildren('titleItem') titleItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('toolItem') toolItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('articleCard') articleCardRefs!: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private animationService: AnimationService,
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
    private seoService: SeoService,
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.setMeta();

    this.blogService.getArticles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(articles => {
        this.articles = articles;
        this.tags = [...new Set(articles.flatMap(article => article.tags))].sort();
        this.applyFilters();
      });

    this.searchSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(query => {
        this.searchQuery = query;
        this.applyFilters(true);
      });

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((_event: LangChangeEvent) => {
        this.setMeta();
        this.applyFilters();
        setTimeout(() => this.animationService.refreshScrollTriggers(), 0);
      });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.pageRootRef?.nativeElement.focus();
    setTimeout(() => this.animatePage(), 0);
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.pageRootRef?.nativeElement) {
      this.animationService.killTriggersForElement(this.pageRootRef.nativeElement);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  selectCategory(category: BlogCategoryFilter): void {
    if (this.selectedCategory === category) return;
    this.selectedCategory = category;
    this.applyFilters(true);
  }

  toggleTag(tag: string): void {
    this.selectedTags.has(tag) ? this.selectedTags.delete(tag) : this.selectedTags.add(tag);
    this.applyFilters(true);
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.selectedTags.clear();
    this.searchQuery = '';
    this.applyFilters(true);
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags.has(tag);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-CA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  private applyFilters(animate = false): void {
    const query = this.searchQuery.trim().toLowerCase();
    const selectedTags = [...this.selectedTags];

    const nextArticles = this.articles.filter(article => {
      const categoryMatches = this.selectedCategory === 'all' || article.category === this.selectedCategory;
      const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => article.tags.includes(tag));
      const queryMatches = !query
        || article.title.toLowerCase().includes(query)
        || article.excerpt.toLowerCase().includes(query)
        || article.tags.some(tag => tag.toLowerCase().includes(query));

      return categoryMatches && tagsMatch && queryMatches;
    });

    if (animate && this.isBrowser && this.articleGridRef?.nativeElement) {
      this.animationService.animateBlogFilterOut(this.articleGridRef.nativeElement, () => {
        this.filteredArticles = nextArticles;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.animationService.animateBlogFilterIn(
            this.articleCardRefs.map(ref => ref.nativeElement),
            this.articleGridRef.nativeElement
          );
          this.animationService.refreshScrollTriggers();
        }, 0);
      });
      return;
    }

    this.filteredArticles = nextArticles;
    this.cdr.markForCheck();
  }

  private setMeta(): void {
    const lang = this.seoService.getActiveLang();
    const title = lang === 'en' ? 'Blog - Abdou Kader SECK' : 'Blog - Abdou Kader SECK';
    const description = lang === 'en'
      ? 'Technical articles and notes about software development, cloud, backend architectures, networking, and modern systems.'
      : 'Articles et notes techniques autour du développement logiciel, du cloud, des architectures backend, des réseaux et des systèmes modernes.';

    this.seoService.updateMetaTags({
      title,
      description,
      canonicalUrl: '/blog',
      keywords: [
        'développement logiciel',
        'génie logiciel',
        'développement fullstack',
        'backend',
        'cloud computing',
        'DevOps',
        'architecture logicielle',
        'systèmes distribués',
        'Kafka',
        'Docker',
        'Angular',
        'Spring Boot',
        'APIs REST',
        'réseaux',
        'blog technique'
      ],
      type: 'website',
    });
  }
  private animatePage(): void {
    const rootEl = this.pageRootRef?.nativeElement;
    if (!rootEl) return;

    this.animationService.animateBlogPageSection(
      rootEl,
      this.titleItemRefs.map(ref => ref.nativeElement),
      this.toolItemRefs.map(ref => ref.nativeElement),
      this.articleCardRefs.map(ref => ref.nativeElement)
    );
  }
}
