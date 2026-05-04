import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article, ArticleCategory } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly articles: Omit<Article, 'readTimeMinutes'>[] = [
    {
      id: 'angular-performance-tips',
      title: {
        fr: 'Optimiser une application Angular moderne',
        en: 'Optimizing a Modern Angular App',
      },
      summary: {
        fr: 'Quelques leviers concrets pour garder une interface Angular rapide, lisible et maintenable.',
        en: 'Concrete levers for keeping an Angular interface fast, readable, and maintainable.',
      },
      content: {
        fr: `
          <h2>Commencer par mesurer</h2>
          <p>Placeholder Epic 6 : avant d'optimiser, il faut identifier les zones lentes avec les outils du navigateur, Angular DevTools et les métriques réelles.</p>
          <h2>Réduire le travail inutile</h2>
          <p>Le couple OnPush, des composants bien découpés et des flux RxJS simples permet de limiter les rendus superflus.</p>
          <pre><code>changeDetection: ChangeDetectionStrategy.OnPush</code></pre>
          <blockquote>Une interface performante est souvent une interface qui fait moins de choses, mais au bon moment.</blockquote>
          <h3>Checklist rapide</h3>
          <ul><li>Lazy-load des routes lourdes.</li><li>Images adaptées et chargées progressivement.</li><li>Animations courtes et non bloquantes.</li></ul>
        `,
        en: `
          <h2>Start by measuring</h2>
          <p>Epic 6 placeholder: before optimizing, identify slow areas with browser tooling, Angular DevTools, and real metrics.</p>
          <h2>Reduce unnecessary work</h2>
          <p>OnPush, well-scoped components, and simple RxJS flows help limit unnecessary rendering.</p>
          <pre><code>changeDetection: ChangeDetectionStrategy.OnPush</code></pre>
          <blockquote>A performant interface is often an interface that does fewer things, at the right time.</blockquote>
          <h3>Quick checklist</h3>
          <ul><li>Lazy-load heavy routes.</li><li>Use adapted, progressively loaded images.</li><li>Keep animations short and non-blocking.</li></ul>
        `,
      },
      publishedAt: '2026-01-12',
      category: 'tips',
      tags: ['Angular', 'Performance', 'UX'],
      coverImage: {
        src: 'assets/images/blog/angular-performance.jpg',
        alt: {
          fr: 'Aperçu abstrait d’une interface Angular performante',
          en: 'Abstract preview of a performant Angular interface',
        },
      },
      status: 'published',
      featured: true,
    },
    {
      id: 'fullstack-api-contracts',
      title: {
        fr: 'Contrats API : le pont entre frontend et backend',
        en: 'API Contracts: The Bridge Between Frontend and Backend',
      },
      summary: {
        fr: 'Pourquoi des contrats API clairs réduisent les frictions dans les équipes Fullstack.',
        en: 'Why clear API contracts reduce friction in Fullstack teams.',
      },
      content: {
        fr: `
          <h2>Un langage commun</h2>
          <p>Placeholder Epic 6 : un contrat API bien défini évite les ambiguïtés entre l'interface, le backend et les tests.</p>
          <h2>Documenter les cas limites</h2>
          <p>Les erreurs, les états vides et les champs optionnels méritent autant d'attention que le happy path.</p>
          <pre><code>GET /api/projects?status=published</code></pre>
          <p>Le résultat est une intégration plus calme, plus prévisible et plus facile à faire évoluer.</p>
        `,
        en: `
          <h2>A shared language</h2>
          <p>Epic 6 placeholder: a well-defined API contract removes ambiguity between the interface, backend, and tests.</p>
          <h2>Document edge cases</h2>
          <p>Errors, empty states, and optional fields deserve as much attention as the happy path.</p>
          <pre><code>GET /api/projects?status=published</code></pre>
          <p>The result is a calmer, more predictable integration that is easier to evolve.</p>
        `,
      },
      publishedAt: '2025-11-05',
      category: 'tutorial',
      tags: ['API', 'Backend', 'Architecture'],
      coverImage: {
        src: 'assets/images/blog/api-contracts.jpg',
        alt: {
          fr: 'Aperçu abstrait de contrats API',
          en: 'Abstract preview of API contracts',
        },
      },
      status: 'published',
      featured: true,
    },
    {
      id: 'building-accessible-components',
      title: {
        fr: 'Construire des composants accessibles dès le départ',
        en: 'Building Accessible Components From the Start',
      },
      summary: {
        fr: 'Quelques habitudes simples pour rendre les composants UI plus robustes et inclusifs.',
        en: 'Simple habits for making UI components more robust and inclusive.',
      },
      content: {
        fr: `
          <h2>L'accessibilité comme contrainte de design</h2>
          <p>Placeholder Epic 6 : les états focus, les labels et la navigation clavier doivent être pensés avant les finitions visuelles.</p>
          <h2>Tester avec le clavier</h2>
          <p>Un composant utilisable sans souris révèle souvent les vrais problèmes de structure HTML.</p>
          <blockquote>Un bon composant ne dépend pas d'un seul mode d'interaction.</blockquote>
        `,
        en: `
          <h2>Accessibility as a design constraint</h2>
          <p>Epic 6 placeholder: focus states, labels, and keyboard navigation should be designed before visual polish.</p>
          <h2>Test with the keyboard</h2>
          <p>A component that works without a mouse often reveals the real HTML structure issues.</p>
          <blockquote>A good component does not depend on a single interaction mode.</blockquote>
        `,
      },
      publishedAt: '2025-09-18',
      category: 'case-study',
      tags: ['Accessibility', 'Frontend', 'Components'],
      coverImage: {
        src: 'assets/images/blog/accessibility.jpg',
        alt: {
          fr: 'Aperçu abstrait de composants accessibles',
          en: 'Abstract preview of accessible components',
        },
      },
      status: 'published',
      featured: true,
    },
    {
      id: 'why-write-technical-notes',
      title: {
        fr: 'Pourquoi écrire des notes techniques',
        en: 'Why Write Technical Notes',
      },
      summary: {
        fr: 'L’écriture comme outil de clarification, de transmission et de progression.',
        en: 'Writing as a tool for clarity, sharing, and progress.',
      },
      content: {
        fr: '<h2>Penser plus clairement</h2><p>Placeholder Epic 6 : écrire force à nommer les décisions, les compromis et les apprentissages.</p>',
        en: '<h2>Think more clearly</h2><p>Epic 6 placeholder: writing forces decisions, tradeoffs, and learnings to be named.</p>',
      },
      publishedAt: '2025-07-02',
      category: 'opinion',
      tags: ['Writing', 'Career'],
      status: 'published',
      featured: false,
    },
    {
      id: 'docker-for-portfolio-projects',
      title: {
        fr: 'Dockeriser un projet portfolio',
        en: 'Dockerizing a Portfolio Project',
      },
      summary: {
        fr: 'Un aperçu pratique pour rendre un projet plus portable et plus simple à exécuter.',
        en: 'A practical overview for making a project more portable and easier to run.',
      },
      content: {
        fr: '<h2>Un environnement reproductible</h2><p>Placeholder Epic 6 : Docker aide à réduire les surprises entre machines et environnements.</p>',
        en: '<h2>A reproducible environment</h2><p>Epic 6 placeholder: Docker helps reduce surprises between machines and environments.</p>',
      },
      publishedAt: '2025-05-22',
      category: 'tutorial',
      tags: ['Docker', 'DevOps'],
      status: 'published',
      featured: false,
    },
  ];

  getArticles(): Observable<Article[]> {
    return of(this.sortArticles(this.publishedArticles()));
  }

  getFeaturedArticles(): Observable<Article[]> {
    return of(this.sortArticles(this.publishedArticles().filter(article => article.featured)).slice(0, 3));
  }

  getArticleBySlug(slug: string): Observable<Article | undefined> {
    return of(this.publishedArticles().find(article => article.id === slug));
  }

  getRelatedArticles(slug: string, limit: number): Observable<Article[]> {
    const article = this.publishedArticles().find(item => item.id === slug);
    if (!article) return of([]);

    const related = this.publishedArticles()
      .filter(item => item.id !== slug)
      .sort((a, b) => this.getRelationScore(b, article) - this.getRelationScore(a, article));

    return of(related.slice(0, limit));
  }

  private publishedArticles(): Article[] {
    return this.articles
      .filter(article => article.status === 'published')
      .map(article => ({
        ...article,
        readTimeMinutes: this.calculateReadTime(article.content.fr + ' ' + article.content.en),
      }));
  }

  private sortArticles(articles: Article[]): Article[] {
    return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  private calculateReadTime(content: string): number {
    const plainText = content.replace(/<[^>]+>/g, ' ');
    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 220));
  }

  private getRelationScore(candidate: Article, source: Article): number {
    const categoryScore = candidate.category === source.category ? 4 : 0;
    const tagScore = candidate.tags.filter(tag => source.tags.includes(tag)).length;
    return categoryScore + tagScore;
  }
}
