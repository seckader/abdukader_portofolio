import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AnimationService } from '../../services/animation';
import { CursorService, CursorState } from '../../services/cursor.service';

type Gsap = typeof import('gsap').default;

const CURSOR_STATE_CLASSES = ['is-hover', 'is-hidden', 'is-text', 'is-drag'];
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], .cursor-hover';
const TEXT_SELECTOR = 'input[type="text"], textarea';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.html',
  styleUrl: './cursor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CursorComponent implements OnInit, OnDestroy {
  @ViewChild('dot', { static: true }) dotRef!: ElementRef<HTMLElement>;
  @ViewChild('ring', { static: true }) ringRef!: ElementRef<HTMLElement>;

  private gsap?: Gsap;
  private readonly cleanupListeners: Array<() => void> = [];
  private readonly isBrowser: boolean;

  constructor(
    public cursorService: CursorService,
    private animationService: AnimationService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    effect(() => {
      this.applyState(this.cursorService.state());
    });
  }

  async ngOnInit(): Promise<void> {
    if (!this.isBrowser || 'ontouchstart' in window) return;

    const gsapModule = await import('gsap');
    this.gsap = gsapModule.default;

    this.initCursor();
    this.bindEvents();
    this.bindHoverTargets();
  }

  ngOnDestroy(): void {
    this.cleanupListeners.forEach(cleanup => cleanup());
    this.cleanupListeners.length = 0;
    this.cursorService.reset();
  }

  private initCursor(): void {
    const dot = this.dotRef.nativeElement;
    const ring = this.ringRef.nativeElement;

    this.gsap?.set([dot, ring], { x: -100, y: -100 });
  }

  private bindEvents(): void {
    const onMouseMove = (event: MouseEvent): void => {
      const dot = this.dotRef.nativeElement;
      const ring = this.ringRef.nativeElement;

      this.gsap?.set(dot, { x: event.clientX, y: event.clientY });
      this.gsap?.to(ring, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.45,
        ease: 'power3.out',
      });
    };

    const onMouseLeave = (): void => this.cursorService.setState('hidden');
    const onMouseEnter = (): void => this.cursorService.reset();

    this.addDocumentListener('mousemove', onMouseMove);
    this.addDocumentListener('mouseleave', onMouseLeave);
    this.addDocumentListener('mouseenter', onMouseEnter);
  }

  private bindHoverTargets(): void {
    const onMouseOver = (event: MouseEvent): void => {
      const target = this.asElement(event.target);
      if (!target) return;

      if (target.closest(TEXT_SELECTOR)) {
        this.cursorService.setState('text');
        return;
      }

      if (target.closest(INTERACTIVE_SELECTOR)) {
        this.cursorService.setState('hover');
      }
    };

    const onMouseOut = (event: MouseEvent): void => {
      const target = this.asElement(event.target);
      if (!target) return;

      const activeTarget = target.closest(`${TEXT_SELECTOR}, ${INTERACTIVE_SELECTOR}`);
      if (!activeTarget) return;

      const relatedTarget = this.asElement(event.relatedTarget);
      if (relatedTarget && activeTarget.contains(relatedTarget)) return;

      this.cursorService.reset();
    };

    this.addDocumentListener('mouseover', onMouseOver);
    this.addDocumentListener('mouseout', onMouseOut);
  }

  private applyState(state: CursorState): void {
    if (!this.dotRef || !this.ringRef) return;

    const dot = this.dotRef.nativeElement;
    const ring = this.ringRef.nativeElement;
    const stateClass = state === 'default' ? '' : `is-${state}`;

    dot.classList.remove(...CURSOR_STATE_CLASSES);
    ring.classList.remove(...CURSOR_STATE_CLASSES);

    if (stateClass) {
      dot.classList.add(stateClass);
      ring.classList.add(stateClass);
    }
  }

  private addDocumentListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (event: DocumentEventMap[K]) => void
  ): void {
    document.addEventListener(type, listener);
    this.cleanupListeners.push(() => document.removeEventListener(type, listener));
  }

  private asElement(target: EventTarget | null): Element | null {
    return target instanceof Element ? target : null;
  }
}
