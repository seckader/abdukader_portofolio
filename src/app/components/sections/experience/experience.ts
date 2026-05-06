import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Experience } from '../../../models/experience.model';
import { AnimationService } from '../../../services/animation';
import { AppStateService } from '../../../services/app-state';
import { ExperienceService } from '../../../services/experience.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ExperienceComponent implements OnInit, AfterViewInit, OnDestroy {
  experiences$!: Observable<Experience[]>;
  selectedIndex = 0;

  @ViewChildren('headerItem') headerItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('tabItem') tabItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('panel') panelRef!: ElementRef<HTMLElement>;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private experienceService: ExperienceService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.experiences$ = this.experienceService.getExperiences();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.appStateService.preloaderComplete$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => this.animateSection());
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.panelRef?.nativeElement) {
      const root = this.panelRef.nativeElement.closest('.experience');
      if (root instanceof HTMLElement) {
        this.animationService.killTriggersForElement(root);
      }
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTab(index: number): void {
    if (this.selectedIndex === index) return;

    this.selectedIndex = index;
    this.cdr.markForCheck();

    if (this.isBrowser && this.panelRef?.nativeElement) {
      this.animationService.animateExperiencePanel(this.panelRef.nativeElement);
    }
  }

  onTabKeydown(event: KeyboardEvent, index: number, total: number): void {
    const keyActions: Record<string, number> = {
      ArrowUp: this.getPreviousIndex(index, total),
      ArrowLeft: this.getPreviousIndex(index, total),
      ArrowDown: this.getNextIndex(index, total),
      ArrowRight: this.getNextIndex(index, total),
      Home: 0,
      End: total - 1,
    };

    const targetIndex = keyActions[event.key];
    if (targetIndex === undefined) return;

    event.preventDefault();
    this.selectTab(targetIndex);
    this.focusTab(targetIndex);
  }

  getTabId(index: number): string {
    return `experience-tab-${index}`;
  }

  getPanelId(index: number): string {
    return `experience-panel-${index}`;
  }

  private animateSection(): void {
    const headerEls = this.headerItemRefs.map(ref => ref.nativeElement);
    const tabEls = this.tabItemRefs.map(ref => ref.nativeElement);
    const panelEl = this.panelRef?.nativeElement;

    if (!panelEl) return;

    this.animationService.animateExperienceSection(headerEls, tabEls, panelEl);
  }

  private focusTab(index: number): void {
    const tab = this.tabItemRefs.get(index)?.nativeElement;
    tab?.focus();
  }

  private getPreviousIndex(index: number, total: number): number {
    return index === 0 ? total - 1 : index - 1;
  }

  private getNextIndex(index: number, total: number): number {
    return index === total - 1 ? 0 : index + 1;
  }
}
