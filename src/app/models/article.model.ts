export type ArticleCategory = 'tutorial' | 'opinion' | 'case-study' | 'tips' | 'other';

export type ArticleStatus = 'published' | 'draft';

export interface LocalizedText {
  fr: string;
  en: string;
}

export interface ArticleCoverImage {
  src: string;
  alt: LocalizedText;
}

export interface Article {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  content: LocalizedText;
  publishedAt: string;
  readTimeMinutes: number;
  category: ArticleCategory;
  tags: string[];
  coverImage?: ArticleCoverImage;
  status: ArticleStatus;
  featured: boolean;
}
