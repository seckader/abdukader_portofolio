import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {

  readonly defaultScrollConfig = {
    start: 'top 85%',
    toggleActions: 'play none none none',
  };

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initGSAP();
    }
  }

  // ============================================
  // INIT
  // ============================================
  private initGSAP(): void {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Config globale GSAP
    gsap.config({
      nullTargetWarn: false,
      trialWarn: false
    });

    // Defaults globaux
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.6
    });
  }

  // ============================================
  // PRELOADER
  // ============================================
  animatePreloaderIn(
    counterEl: Element,
    statusEl: Element,
    progressEl: Element,
    onComplete: () => void
  ): void {
    if (!this.isBrowser) return;

    const tl = gsap.timeline({ onComplete });

    // Entrée des éléments
    tl.fromTo(statusEl,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 }
    )
    .fromTo(counterEl,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      '-=0.2'
    )
    .fromTo(progressEl,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.3 },
      '-=0.2'
    );
  }

  animateCounter(
    onUpdate: (value: number) => void,
    onComplete: () => void
  ): void {
    if (!this.isBrowser) return;

    const obj = { value: 0 };

    gsap.to(obj, {
      value: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => onUpdate(Math.round(obj.value)),
      onComplete
    });
  }

  animatePreloaderOut(
    preloaderEl: Element,
    onComplete: () => void
  ): void {
    if (!this.isBrowser) return;

    const tl = gsap.timeline({ onComplete });

    tl.to(preloaderEl, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut'
    });
  }

  // ============================================
  // PAGE ENTRANCE
  // ============================================
  animatePageIn(elements: Element[]): void {
    if (!this.isBrowser || !elements.length) return;

    gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }

  animateLayoutIn(sidebar: Element, sections: Element[]): void {
    if (!this.isBrowser) return;

    const tl = gsap.timeline();

    tl.to(sidebar, {
      opacity: 1,
      x: 0,
      duration: 0.75,
      ease: 'power3.out'
    });

    if (sections.length) {
      tl.to(sections, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out'
      }, '-=0.45');
    }
  }

  animateAboutIntro(elements: Element[]): void {
    if (!this.isBrowser || !elements.length) return;
    if (this.isReducedMotion()) {
      gsap.set(elements, { opacity: 1, clearProps: 'transform' });
      return;
    }

    gsap.fromTo(elements,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.15
      }
    );
  }

  animateAboutOnScroll(section: Element): void {
    if (!this.isBrowser) return;

    gsap.fromTo(section,
      { filter: 'brightness(0.92)' },
      {
        filter: 'brightness(1)',
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  animateExperienceSection(headerEls: Element[], tabEls: Element[], panelEl: Element): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set([...headerEls, ...tabEls, panelEl], { opacity: 1, clearProps: 'transform' });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panelEl,
        ...this.defaultScrollConfig
      }
    });

    if (headerEls.length) {
      tl.fromTo(headerEls,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }

    if (tabEls.length) {
      tl.fromTo(tabEls,
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out'
        },
        '-=0.25'
      );
    }

    tl.fromTo(panelEl,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      },
      '-=0.2'
    );
  }

  animateExperiencePanel(panelEl: Element): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set(panelEl, { opacity: 1, clearProps: 'transform' });
      return;
    }

    gsap.fromTo(panelEl,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out'
      }
    );
  }

  animateSkillsSection(
    headerEls: Element[],
    filterEls: Element[],
    cardEls: Element[],
    triggerEl: Element
  ): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set([...headerEls, ...filterEls, ...cardEls], { opacity: 1, clearProps: 'transform' });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        ...this.defaultScrollConfig
      }
    });

    if (headerEls.length) {
      tl.fromTo(headerEls,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out'
        }
      );
    }

    if (filterEls.length) {
      tl.fromTo(filterEls,
        { opacity: 0, y: -16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: 'power3.out'
        },
        '-=0.2'
      );
    }

    if (cardEls.length) {
      tl.fromTo(cardEls,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: {
            each: Math.min(0.06, 1.5 / cardEls.length),
            from: 'start',
            grid: 'auto'
          },
          ease: 'back.out(1.2)'
        },
        '-=0.15'
      );
    }
  }

  animateSkillsFilterOut(gridEl: Element, onComplete: () => void): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      onComplete();
      return;
    }

    gsap.to(gridEl, {
      opacity: 0,
      scale: 0.85,
      duration: 0.22,
      ease: 'power2.out',
      onComplete
    });
  }

  animateSkillsFilterIn(cardEls: Element[]): void {
    if (!this.isBrowser) return;

    const targets = cardEls.length ? cardEls : [];
    if (this.isReducedMotion()) {
      gsap.set([targets, targets[0]?.parentElement].filter(Boolean), { opacity: 1, clearProps: 'transform' });
      this.refreshScrollTriggers();
      return;
    }

    gsap.set(targets, { opacity: 0, scale: 0.9 });
    gsap.to(targets, {
      opacity: 1,
      scale: 1,
      duration: 0.36,
      stagger: 0.045,
      ease: 'back.out(1.2)'
    });

    if (targets[0]?.parentElement) {
      gsap.to(targets[0].parentElement, {
        opacity: 1,
        y: 0,
        duration: 0.18,
        ease: 'power2.out',
        onComplete: () => this.refreshScrollTriggers()
      });
    }
  }

  animateProjectsSection(
    headerEls: Element[],
    featuredEls: Element[],
    secondaryEls: Element[],
    triggerEl: Element,
    moreButtonEl?: Element
  ): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set([...headerEls, ...featuredEls, ...secondaryEls, moreButtonEl].filter(Boolean), { opacity: 1, clearProps: 'transform' });
      return;
    }

    gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        ...this.defaultScrollConfig
      }
    })
    .fromTo(headerEls,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out'
      }
    );

    featuredEls.forEach((featuredEl, index) => {
      gsap.fromTo(featuredEl,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuredEl,
            ...this.defaultScrollConfig
          }
        }
      );

      const mediaEl = featuredEl.querySelector('.featured-card__media');
      if (mediaEl) {
        gsap.fromTo(mediaEl,
          { opacity: 0, x: index % 2 === 0 ? 30 : -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: featuredEl,
              ...this.defaultScrollConfig
            }
          }
        );
      }
    });

    if (secondaryEls.length) {
      gsap.fromTo(secondaryEls,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: {
            each: 0.07,
            from: 'start',
            grid: 'auto'
          },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: secondaryEls[0],
            ...this.defaultScrollConfig,
            start: 'top 90%'
          }
        }
      );
    }

    if (moreButtonEl) {
      gsap.fromTo(moreButtonEl,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: moreButtonEl,
            ...this.defaultScrollConfig,
            start: 'top 95%'
          }
        }
      );
    }
  }

  animateProjectsGridOut(gridEl: Element, onComplete: () => void): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      onComplete();
      return;
    }

    gsap.to(gridEl, {
      opacity: 0,
      y: 14,
      duration: 0.22,
      ease: 'power2.out',
      onComplete
    });
  }

  animateProjectsGridIn(cardEls: Element[], gridEl: Element): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set([gridEl, ...cardEls], { opacity: 1, clearProps: 'transform' });
      this.refreshScrollTriggers();
      return;
    }

    gsap.to(gridEl, {
      opacity: 1,
      y: 0,
      duration: 0.18,
      ease: 'power2.out'
    });

    if (!cardEls.length) return;

    gsap.fromTo(cardEls,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
      duration: 0.38,
      stagger: 0.05,
      ease: 'power2.out',
      onComplete: () => this.refreshScrollTriggers()
      }
    );
  }

  animateAboutSection(titleEls: Element[], bioEls: Element[], metaEls: Element[], triggerEl: Element): void {
    if (!this.isBrowser) return;
    const targets = [...titleEls, ...bioEls, ...metaEls];

    if (this.isReducedMotion()) {
      gsap.set(targets, { opacity: 1, clearProps: 'transform' });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        ...this.defaultScrollConfig,
      }
    });

    if (titleEls.length) {
      tl.fromTo(titleEls,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      );
    }

    if (bioEls.length) {
      tl.fromTo(bioEls,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
        '-=0.1'
      );
    }

    if (metaEls.length) {
      tl.fromTo(metaEls,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
        '+=0.05'
      );
    }
  }

  animateBlogSection(headerEls: Element[], cardEls: Element[], triggerEl: Element, ctaEl?: Element): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set([...headerEls, ...cardEls, ctaEl].filter(Boolean), { opacity: 1, clearProps: 'transform' });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        ...this.defaultScrollConfig
      }
    });

    if (headerEls.length) {
      tl.fromTo(headerEls,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out'
        }
      );
    }

    if (cardEls.length) {
      tl.fromTo(cardEls,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power2.out'
        },
        '-=0.18'
      );
    }

    if (ctaEl) {
      tl.fromTo(ctaEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' },
        '+=0.05'
      );
    }
  }

  animateBlogPageIn(cardEls: Element[]): void {
    if (!this.isBrowser || !cardEls.length) return;
    if (this.isReducedMotion()) {
      gsap.set(cardEls, { opacity: 1, clearProps: 'transform' });
      return;
    }

    gsap.fromTo(cardEls,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out'
      }
    );
  }

  animateBlogFilterOut(gridEl: Element, onComplete: () => void): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      onComplete();
      return;
    }

    gsap.to(gridEl, {
      opacity: 0,
      y: 12,
      duration: 0.2,
      ease: 'power2.out',
      onComplete
    });
  }

  animateBlogFilterIn(cardEls: Element[], gridEl: Element): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set([gridEl, ...cardEls], { opacity: 1, clearProps: 'transform' });
      this.refreshScrollTriggers();
      return;
    }

    gsap.to(gridEl, {
      opacity: 1,
      y: 0,
      duration: 0.18,
      ease: 'power2.out'
    });

    if (!cardEls.length) return;

    gsap.fromTo(cardEls,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
      duration: 0.34,
      stagger: 0.05,
      ease: 'power2.out',
      onComplete: () => this.refreshScrollTriggers()
      }
    );
  }

  animateArticlePageIn(rootEl: Element): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set(rootEl, { opacity: 1, clearProps: 'transform' });
      return;
    }

    gsap.fromTo(rootEl,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out'
      }
    );
  }

  animateRouteOut(routeEl: Element): void {
    if (!this.isBrowser) return;

    gsap.to(routeEl, {
      opacity: 0.7,
      y: 8,
      duration: 0.18,
      ease: 'power2.out'
    });
  }

  animateRouteIn(routeEl: Element): void {
    if (!this.isBrowser) return;

    gsap.fromTo(routeEl,
      { opacity: 0.7, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.28,
        ease: 'power2.out'
      }
    );
  }

  animateContactSection(
    introEls: Element[],
    detailEls: Element[],
    socialEls: Element[],
    triggerEl: Element
  ): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set([...introEls, ...detailEls, ...socialEls], { opacity: 1, clearProps: 'transform' });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        ...this.defaultScrollConfig
      }
    });

    if (introEls.length) {
      tl.fromTo(introEls,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out'
        }
      );
    }

    if (detailEls.length) {
      tl.fromTo(detailEls,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out'
        },
        '-=0.18'
      );
    }

    if (socialEls.length) {
      tl.fromTo(socialEls,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out'
        },
        '-=0.2'
      );
    }
  }

  animateFooterIn(footerEl: Element): void {
    if (!this.isBrowser) return;
    if (this.isReducedMotion()) {
      gsap.set(footerEl, { opacity: 1, clearProps: 'transform' });
      return;
    }

    gsap.fromTo(footerEl,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerEl,
          ...this.defaultScrollConfig,
          start: 'top 95%'
        }
      }
    );
  }

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  animateOnScroll(element: Element, options?: gsap.TweenVars): void {
    if (!this.isBrowser) return;

    gsap.fromTo(element,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        ...options,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  animateStaggerOnScroll(elements: Element[], options?: gsap.TweenVars): void {
    if (!this.isBrowser) return;

    gsap.fromTo(elements,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        ...options,
        scrollTrigger: {
          trigger: elements[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  scrollTo(target: string | number, duration = 0.8): void {
    if (!this.isBrowser) return;

    gsap.to(window, {
      duration,
      scrollTo: { y: target, offsetY: 80 },
      ease: 'power3.inOut'
    });
  }

  // ============================================
  // UTILS
  // ============================================
  killAll(): void {
    if (!this.isBrowser) return;
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
  }

  killScrollTriggersFor(triggers: Element[]): void {
    if (!this.isBrowser || !triggers.length) return;

    ScrollTrigger.getAll()
      .filter(trigger => triggers.includes(trigger.vars.trigger as Element))
      .forEach(trigger => trigger.kill());
  }

  killTriggersForElement(element: HTMLElement): void {
    if (!this.isBrowser) return;

    ScrollTrigger.getAll()
      .filter(trigger => this.triggerBelongsToElement(trigger.vars.trigger, element))
      .forEach(trigger => trigger.kill());
  }

  refreshScrollTriggers(): void {
    if (!this.isBrowser) return;
    ScrollTrigger.refresh();
  }

  isReducedMotion(): boolean {
    return this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  animateSidebarIn(introEls: Element[], navEls: Element[], socialEls: Element[]): void {
    if (!this.isBrowser) return;
    const targets = [...introEls, ...navEls, ...socialEls];

    if (this.isReducedMotion()) {
      gsap.set(targets, { opacity: 1, clearProps: 'transform' });
      return;
    }

    const tl = gsap.timeline();

    if (introEls.length) {
      tl.fromTo(introEls,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' }
      );
    }

    if (navEls.length) {
      tl.fromTo(navEls,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out' },
        '-=0.2'
      );
    }

    if (socialEls.length) {
      tl.fromTo(socialEls,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
        '-=0.15'
      );
    }
  }

  animateBlogPageSection(rootEl: Element, titleEls: Element[], toolEls: Element[], cardEls: Element[]): void {
    if (!this.isBrowser) return;
    const targets = [...titleEls, ...toolEls, ...cardEls];

    if (this.isReducedMotion()) {
      gsap.set(targets, { opacity: 1, clearProps: 'transform' });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootEl,
        ...this.defaultScrollConfig,
      }
    });

    tl.fromTo(titleEls, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' });

    if (toolEls.length) {
      tl.fromTo(toolEls, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }, '-=0.15');
    }

    if (cardEls.length) {
      tl.fromTo(cardEls, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.1');
    }
  }

  animateArticleSections(rootEl: Element, titleEls: Element[], contentEl?: Element): void {
    if (!this.isBrowser) return;
    const targets = contentEl ? [...titleEls, contentEl] : titleEls;

    if (this.isReducedMotion()) {
      gsap.set(targets, { opacity: 1, clearProps: 'transform' });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootEl,
        ...this.defaultScrollConfig,
      }
    });

    if (titleEls.length) {
      tl.fromTo(titleEls, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
    }

    if (contentEl) {
      tl.fromTo(contentEl, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.05');
    }
  }

  private triggerBelongsToElement(trigger: unknown, element: HTMLElement): boolean {
    return trigger instanceof Element && (trigger === element || element.contains(trigger));
  }
  
}
