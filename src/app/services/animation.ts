import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panelEl,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    if (headerEls.length) {
      tl.fromTo(headerEls,
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
      { opacity: 0, x: 28 },
      {
        opacity: 1,
        x: 0,
        duration: 0.65,
        ease: 'power3.out'
      },
      '-=0.2'
    );
  }

  animateExperiencePanel(panelEl: Element): void {
    if (!this.isBrowser) return;

    gsap.fromTo(panelEl,
      { opacity: 0, x: 18 },
      {
        opacity: 1,
        x: 0,
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top 78%',
        toggleActions: 'play none none none'
      }
    });

    if (headerEls.length) {
      tl.fromTo(headerEls,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out'
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
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: {
            each: 0.06,
            from: 'start',
            grid: 'auto'
          },
          ease: 'power3.out'
        },
        '-=0.15'
      );
    }
  }

  animateSkillsFilterOut(gridEl: Element, onComplete: () => void): void {
    if (!this.isBrowser) return;

    gsap.to(gridEl, {
      opacity: 0,
      y: 12,
      duration: 0.22,
      ease: 'power2.out',
      onComplete
    });
  }

  animateSkillsFilterIn(cardEls: Element[]): void {
    if (!this.isBrowser) return;

    const targets = cardEls.length ? cardEls : [];

    gsap.set(targets, { opacity: 0, y: 18 });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.36,
      stagger: 0.045,
      ease: 'power2.out'
    });

    if (targets[0]?.parentElement) {
      gsap.to(targets[0].parentElement, {
        opacity: 1,
        y: 0,
        duration: 0.18,
        ease: 'power2.out'
      });
    }
  }

  animateProjectsSection(
    headerEls: Element[],
    featuredEls: Element[],
    secondaryEls: Element[],
    triggerEl: Element
  ): void {
    if (!this.isBrowser) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top 78%',
        toggleActions: 'play none none none'
      }
    })
    .fromTo(headerEls,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out'
      }
    );

    featuredEls.forEach((featuredEl, index) => {
      gsap.fromTo(featuredEl,
        { opacity: 0, x: index % 2 === 0 ? -44 : 44 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuredEl,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
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
            start: 'top 86%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  animateProjectsGridOut(gridEl: Element, onComplete: () => void): void {
    if (!this.isBrowser) return;

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
        ease: 'power2.out'
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
  
}
