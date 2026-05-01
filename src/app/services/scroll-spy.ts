import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnimationService } from './animation';

export interface NavSection {
  id: string;
  labelKey: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScrollSpyService implements OnDestroy {
  readonly sections: NavSection[] = [
    { id: 'about', labelKey: 'nav.about' },
    { id: 'experience', labelKey: 'nav.experience' },
    { id: 'skills', labelKey: 'nav.skills' },
    { id: 'projects', labelKey: 'nav.projects' },
    { id: 'blog', labelKey: 'nav.blog' },
    { id: 'contact', labelKey: 'nav.contact' },
  ];

  private activeSectionSubject = new BehaviorSubject<string>(this.sections[0].id);
  private observer?: IntersectionObserver;
  private isBrowser: boolean;

  activeSection$ = this.activeSectionSubject.asObservable();

  constructor(
    private animationService: AnimationService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  observeSections(sectionEls: Element[]): void {
    if (!this.isBrowser || !sectionEls.length) return;

    this.disconnect();

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        entries => this.handleEntries(entries),
        {
          root: null,
          rootMargin: '-30% 0px -55% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      sectionEls.forEach(section => this.observer?.observe(section));
    });
  }

  scrollToSection(sectionId: string): void {
    if (!this.isBrowser) return;

    const target = document.getElementById(sectionId);
    if (!target) return;

    this.setActiveSection(sectionId);
    this.animationService.scrollTo(`#${sectionId}`, 0.9);
    window.history.replaceState(null, '', `#${sectionId}`);
  }

  setActiveSection(sectionId: string): void {
    if (this.activeSectionSubject.value === sectionId) return;
    this.activeSectionSubject.next(sectionId);
  }

  disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private handleEntries(entries: IntersectionObserverEntry[]): void {
    const visibleEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry?.target.id) return;

    this.ngZone.run(() => this.setActiveSection(visibleEntry.target.id));
  }
}
