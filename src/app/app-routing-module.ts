import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    pathMatch: 'full'
  },
  {
    path: 'blog',
    loadChildren: () => import('./components/pages/blog/blog.routes').then(m => m.BLOG_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
