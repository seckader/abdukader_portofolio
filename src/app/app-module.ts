import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { TranslateModule, provideTranslateService } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { PreloaderComponent } from './components/preloader/preloader';
import { LayoutComponent } from './components/layout/layout';
import { SidebarComponent } from './components/layout/sidebar/sidebar';
import { NavComponent } from './components/layout/sidebar/nav/nav';
import { SocialLinksComponent } from './components/layout/sidebar/social-links/social-links';
import { MainContentComponent } from './components/layout/main-content/main-content';
import { AboutComponent } from './components/sections/about/about';
import { ExperienceComponent } from './components/sections/experience/experience';
import { SkillsComponent } from './components/sections/skills/skills';
import { ProjectsComponent } from './components/sections/projects/projects';

@NgModule({
  declarations: [
    App,
    LayoutComponent,
    SidebarComponent,
    NavComponent,
    SocialLinksComponent,
    MainContentComponent,
    AboutComponent,
    ExperienceComponent,
    SkillsComponent,
    ProjectsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule,
    PreloaderComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'fr'
    })
  ],
  bootstrap: [App]
})
export class AppModule { }
