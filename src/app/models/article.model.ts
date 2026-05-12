export type ArticleCategory = 'tutorial' | 'opinion' | 'case-study' | 'tips' | 'other';

export interface ArticleCoverImage {
  src: string;
  alt: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  readingTime: number;
  category: ArticleCategory;
  tags: string[];
  coverImage: ArticleCoverImage | null;
  featured: boolean;
}

export interface Article extends ArticleMeta {
  content: string;
}
