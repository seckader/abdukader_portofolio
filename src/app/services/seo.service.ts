import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

export const BASE_URL = 'https://mon-domaine.com';

export type SeoLocale = 'fr' | 'en';
export type OgType = 'website' | 'article' | string;

export interface SeoStructuredData {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

export interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string[];
  image?: string;
  type?: OgType;
  locale?: SeoLocale;
  twitterCreator?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: SeoStructuredData | SeoStructuredData[];
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly renderer: Renderer2;
  private readonly defaultImage = `${BASE_URL}/assets/images/og-cover.jpg`;
  private readonly siteName = 'Abdou Kader SECK';
  private readonly author = 'Abdou Kader SECK';
  private readonly twitterCreator = '@Abdu_Kadeer';

  constructor(
    private meta: Meta,
    private title: Title,
    private translateService: TranslateService,
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  updateMetaTags(config: SeoConfig): void {
    const lang = config.locale ?? this.getActiveLang();
    const canonicalUrl = this.toAbsoluteUrl(config.canonicalUrl);
    const imageUrl = this.toAbsoluteUrl(config.image ?? this.defaultImage);
    const ogLocale = lang === 'en' ? 'en_US' : 'fr_FR';
    const description = this.truncate(config.description, 155);

    this.title.setTitle(config.title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'author', content: this.author });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'language', content: lang });

    if (config.keywords?.length) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    } else {
      this.meta.removeTag('name="keywords"');
    }

    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:type', content: config.type ?? 'website' });
    this.meta.updateTag({ property: 'og:locale', content: ogLocale });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:creator', content: config.twitterCreator ?? this.twitterCreator });

    this.updateArticleMeta(config);
    this.updateCanonicalUrl(canonicalUrl);
    this.updateHreflangLinks(canonicalUrl);
    this.updateStructuredData(config.structuredData);
  }

  updateCanonicalUrl(url: string): void {
    const absoluteUrl = this.toAbsoluteUrl(url);
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.appendChild(this.document.head, link);
    }

    this.renderer.setAttribute(link, 'href', absoluteUrl);
  }

  getAbsoluteUrl(path: string): string {
    return this.toAbsoluteUrl(path);
  }

  getActiveLang(): SeoLocale {
    return this.translateService.currentLang === 'en' ? 'en' : 'fr';
  }

  private updateArticleMeta(config: SeoConfig): void {
    this.meta.removeTag('property="article:published_time"');
    this.meta.removeTag('property="article:modified_time"');

    if (config.type !== 'article') return;

    if (config.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: config.publishedTime });
    }

    if (config.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: config.modifiedTime });
    }
  }

  private updateHreflangLinks(canonicalUrl: string): void {
    this.document
      .querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')
      .forEach(link => this.renderer.removeChild(this.document.head, link));

    const url = new URL(canonicalUrl);
    url.searchParams.delete('lang');

    this.addHreflangLink('fr', this.withLang(url, 'fr'));
    this.addHreflangLink('en', this.withLang(url, 'en'));
    this.addHreflangLink('x-default', url.toString());
  }

  private addHreflangLink(hreflang: string, href: string): void {
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'alternate');
    this.renderer.setAttribute(link, 'hreflang', hreflang);
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.appendChild(this.document.head, link);
  }

  private updateStructuredData(data?: SeoStructuredData | SeoStructuredData[]): void {
    this.document
      .querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"][data-seo="true"]')
      .forEach(script => this.renderer.removeChild(this.document.head, script));

    if (!data) return;

    const items = Array.isArray(data) ? data : [data];

    items.forEach(item => {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'type', 'application/ld+json');
      this.renderer.setAttribute(script, 'data-seo', 'true');
      this.renderer.appendChild(script, this.renderer.createText(JSON.stringify(item)));
      this.renderer.appendChild(this.document.head, script);
    });
  }

  private withLang(url: URL, lang: SeoLocale): string {
    const localizedUrl = new URL(url.toString());
    localizedUrl.searchParams.set('lang', lang);
    return localizedUrl.toString();
  }

  private toAbsoluteUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) return url;
    return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  }

  private truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;

    const trimmed = value.slice(0, maxLength - 1);
    const lastSpace = trimmed.lastIndexOf(' ');
    return `${trimmed.slice(0, lastSpace > 80 ? lastSpace : trimmed.length).trim()}…`;
  }
}
