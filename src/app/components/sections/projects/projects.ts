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
import { map, Observable, Subject, take, takeUntil } from 'rxjs';
import { Project } from '../../../models/project.model';
import { AnimationService } from '../../../services/animation';
import { AppStateService } from '../../../services/app-state';
import { ProjectsService } from '../../../services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  featuredProjects$!: Observable<Project[]>;
  otherProjects$!: Observable<Project[]>;

  featuredProjects: Project[] = [];
  otherProjects: Project[] = [];
  visibleOtherProjects: Project[] = [];
  showAll = false;

  readonly initialOtherLimit = 3;

  @ViewChild('projectsSection') projectsSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('projectsGrid') projectsGridRef!: ElementRef<HTMLElement>;
  @ViewChildren('headerItem') headerItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('featuredCard') featuredCardRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('projectCard') projectCardRefs!: QueryList<ElementRef<HTMLElement>>;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private projectsService: ProjectsService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.featuredProjects$ = this.projectsService.getFeaturedProjects();
    this.otherProjects$ = this.projectsService.getProjects()
      .pipe(map(projects => projects.filter(project => !project.featured)));

    this.featuredProjects$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projects => {
        this.featuredProjects = projects;
        this.cdr.markForCheck();
      });

    this.otherProjects$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projects => {
        this.otherProjects = projects;
        this.syncVisibleProjects();
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.appStateService.preloaderComplete$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => this.animateSection());
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      const triggers = [
        this.projectsSectionRef?.nativeElement,
        ...this.featuredCardRefs.map(ref => ref.nativeElement),
        ...this.projectCardRefs.map(ref => ref.nativeElement),
      ].filter(Boolean) as Element[];

      this.animationService.killScrollTriggersFor(triggers);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleShowAll(): void {
    if (!this.isBrowser || !this.projectsGridRef?.nativeElement) {
      this.showAll = !this.showAll;
      this.syncVisibleProjects();
      this.cdr.markForCheck();
      return;
    }

    this.animationService.animateProjectsGridOut(this.projectsGridRef.nativeElement, () => {
      this.showAll = !this.showAll;
      this.syncVisibleProjects();
      this.cdr.markForCheck();

      setTimeout(() => {
        const cards = this.projectCardRefs.map(ref => ref.nativeElement);
        this.animationService.animateProjectsGridIn(cards, this.projectsGridRef.nativeElement);
      }, 0);
    });
  }

  getWatermark(index: number): string {
    return `${index + 1}`.padStart(2, '0');
  }

  hasExternalLinks(project: Project): boolean {
    return Boolean(project.githubUrl || project.liveUrl);
  }

  private syncVisibleProjects(): void {
    this.visibleOtherProjects = this.showAll
      ? [...this.otherProjects]
      : this.otherProjects.slice(0, this.initialOtherLimit);
  }

  private animateSection(): void {
    const headerEls = this.headerItemRefs.map(ref => ref.nativeElement);
    const featuredEls = this.featuredCardRefs.map(ref => ref.nativeElement);
    const secondaryEls = this.projectCardRefs.map(ref => ref.nativeElement);
    const triggerEl = this.projectsSectionRef?.nativeElement;

    if (!triggerEl) return;

    this.animationService.animateProjectsSection(headerEls, featuredEls, secondaryEls, triggerEl);
  }
}
