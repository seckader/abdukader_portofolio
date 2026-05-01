import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AnimationService } from '../../services/animation';
import { AppStateService } from '../../services/app-state';
import { ScrollSpyService } from '../../services/scroll-spy';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sidebarEntry') sidebarEntryRef!: ElementRef<HTMLElement>;
  @ViewChildren('sectionEntry') sectionEntryRefs!: QueryList<ElementRef<HTMLElement>>;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private appStateService: AppStateService,
    private scrollSpyService: ScrollSpyService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const sections = this.sectionEntryRefs.map(ref => ref.nativeElement);
    this.scrollSpyService.observeSections(sections);

    this.appStateService.preloaderComplete$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.animateEntrance());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.scrollSpyService.disconnect();
  }

  private animateEntrance(): void {
    const sidebar = this.sidebarEntryRef.nativeElement;
    const sections = this.sectionEntryRefs.map(ref => ref.nativeElement);

    this.animationService.animateLayoutIn(sidebar, sections);
  }
}
