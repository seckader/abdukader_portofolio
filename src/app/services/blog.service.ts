import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, switchMap } from 'rxjs';
import { Article, ArticleMeta } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly indexUrl = 'assets/blog/index.json';
  private readonly articlesBaseUrl = 'assets/blog/articles';
  private articles$?: Observable<ArticleMeta[]>;

  constructor(private http: HttpClient) {}

  getArticles(): Observable<ArticleMeta[]> {
    if (!this.articles$) {
      this.articles$ = this.http.get<ArticleMeta[]>(this.indexUrl).pipe(
        map(articles => this.sortArticles(articles)),
        catchError(() => of([])),
        shareReplay(1)
      );
    }

    return this.articles$;
  }

  getFeaturedArticles(): Observable<ArticleMeta[]> {
    return this.getArticles().pipe(
      map(articles => articles.filter(article => article.featured).slice(0, 3))
    );
  }

  getArticleBySlug(slug: string): Observable<Article | undefined> {
    if (!slug) return of(undefined);

    return this.http.get<Article>(`${this.articlesBaseUrl}/${slug}.json`).pipe(
      catchError(() => of(undefined))
    );
  }

  getRelatedArticles(slug: string, limit: number): Observable<ArticleMeta[]> {
    return this.getArticleBySlug(slug).pipe(
      switchMap(article => {
        if (!article) return of([]);

        return this.getArticles().pipe(
          map(articles => articles
            .filter(item => item.slug !== slug)
            .sort((a, b) => this.getRelationScore(b, article) - this.getRelationScore(a, article))
            .slice(0, limit)
          )
        );
      })
    );
  }

  private sortArticles<T extends ArticleMeta>(articles: T[]): T[] {
    return [...articles].sort((a, b) => b.date.localeCompare(a.date));
  }

  private getRelationScore(candidate: ArticleMeta, source: ArticleMeta): number {
    const categoryScore = candidate.category === source.category ? 4 : 0;
    const tagScore = candidate.tags.filter(tag => source.tags.includes(tag)).length;
    return categoryScore + tagScore;
  }
}
