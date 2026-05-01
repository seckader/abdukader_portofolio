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
  
}
