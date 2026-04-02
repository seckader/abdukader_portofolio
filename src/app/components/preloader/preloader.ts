import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation';

// Seuils du compteur → message terminal associé
const TERMINAL_STEPS: { threshold: number; key: string }[] = [
  { threshold: 0,  key: 'preloader.steps.init' },
  { threshold: 20, key: 'preloader.steps.assets' },
  { threshold: 45, key: 'preloader.steps.modules' },
  { threshold: 70, key: 'preloader.steps.render' },
  { threshold: 90, key: 'preloader.steps.ready' },
  { threshold: 100, key: 'preloader.steps.done' },
];

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.html',
  styleUrl: './preloader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, CommonModule]
})
export class PreloaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('preloader')   preloaderRef!:   ElementRef;
  @ViewChild('counter')     counterRef!:     ElementRef;
  @ViewChild('statusEl')    statusRef!:      ElementRef;
  @ViewChild('progressBar') progressBarRef!: ElementRef;

  // Émis quand le slide-up est terminé → app.ts masque le composant
  @Output() preloadComplete = new EventEmitter<void>();

  count:       number = 0;
  status:      string = 'active';
  statusText:  string = '';
  currentDate: string = '';

  private lastStepIndex = -1;
  private isBrowser: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    private animationService: AnimationService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ============================================
  // LIFECYCLE
  // ============================================
  ngOnInit(): void {
    this.currentDate = new Date().toISOString().split('T')[0];
    this.updateStatusText(0); // message initial avant ViewInit
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.startSequence();
  }

  ngOnDestroy(): void {
    this.animationService.killAll();
  }

  // ============================================
  // SÉQUENCE PRINCIPALE
  // ============================================
  private startSequence(): void {
    const counterEl     = this.counterRef.nativeElement;
    const statusEl      = this.statusRef.nativeElement;
    const progressBarEl = this.progressBarRef.nativeElement;

    // 1. Fade-in des éléments UI
    this.animationService.animatePreloaderIn(
      counterEl,
      statusEl,
      progressBarEl,
      () => this.startCounter() // 2. Compteur démarre quand le fade est fini
    );
  }

  private startCounter(): void {
    this.animationService.animateCounter(
      (value: number) => this.onCounterUpdate(value),
      ()              => this.onCounterComplete()
    );
  }

  // ============================================
  // CALLBACKS COMPTEUR
  // ============================================
  private onCounterUpdate(value: number): void {
    this.count = value;
    this.updateStatusText(value);
    this.cdr.markForCheck(); // OnPush + zoneless : indispensable
  }

  private onCounterComplete(): void {
    this.status = 'done';
    this.cdr.markForCheck();

    // Légère pause avant le slide-up (laisse "100%" visible)
    setTimeout(() => this.exitPreloader(), 600);
  }

  private exitPreloader(): void {
    const preloaderEl = this.preloaderRef.nativeElement;

    this.animationService.animatePreloaderOut(
      preloaderEl,
      () => {
        this.preloadComplete.emit(); // → app.ts retire le composant du DOM
      }
    );
  }

  // ============================================
  // MESSAGES TERMINAL
  // ============================================
  private updateStatusText(value: number): void {
    // Trouve le dernier seuil franchi
    let targetIndex = 0;

    for (let i = 0; i < TERMINAL_STEPS.length; i++) {
      if (value >= TERMINAL_STEPS[i].threshold) {
        targetIndex = i;
      }
    }

    // Ne re-traduit que si on change de step (évite les re-renders inutiles)
    if (targetIndex === this.lastStepIndex) return;
    this.lastStepIndex = targetIndex;

    this.translate
      .get(TERMINAL_STEPS[targetIndex].key)
      .subscribe(text => {
        this.statusText = text;
        this.cdr.markForCheck();
      });
  }
}