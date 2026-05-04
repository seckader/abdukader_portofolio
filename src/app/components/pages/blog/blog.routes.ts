import { Routes } from '@angular/router';
import { BlogPageComponent } from './blog-page';
import { ArticlePageComponent } from '../article/article-page';

export const BLOG_ROUTES: Routes = [
  {
    path: '',
    component: BlogPageComponent,
  },
  {
    path: ':slug',
    component: ArticlePageComponent,
  },
];
