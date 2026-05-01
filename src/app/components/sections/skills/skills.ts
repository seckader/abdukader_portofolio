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
import { Subject, take, takeUntil } from 'rxjs';
import { Skill, SkillCategory } from '../../../models/skill.model';
import { AnimationService } from '../../../services/animation';
import { AppStateService } from '../../../services/app-state';
import { SkillsService } from '../../../services/skills.service';

type SkillFilter = SkillCategory | 'all';

interface SkillFilterOption {
  value: SkillFilter;
  labelKey: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly filters: SkillFilterOption[] = [
    { value: 'all', labelKey: 'skills.filter.all' },
    { value: 'frontend', labelKey: 'skills.filter.frontend' },
    { value: 'backend', labelKey: 'skills.filter.backend' },
    { value: 'devops', labelKey: 'skills.filter.devops' },
  ];

  selectedCategory: SkillFilter = 'all';
  skills: Skill[] = [];
  visibleSkills: Skill[] = [];

  @ViewChild('skillsSection') skillsSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('skillsGrid') skillsGridRef!: ElementRef<HTMLElement>;
  @ViewChildren('headerItem') headerItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('filterItem') filterItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('skillCard') skillCardRefs!: QueryList<ElementRef<HTMLElement>>;

  private missingIcons = new Set<string>();
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private skillsService: SkillsService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.skillsService.getSkills()
      .pipe(takeUntil(this.destroy$))
      .subscribe(skills => {
        this.skills = skills;
        this.visibleSkills = this.getFilteredSkills(this.selectedCategory);
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
    if (this.isBrowser && this.skillsSectionRef?.nativeElement) {
      this.animationService.killScrollTriggersFor([this.skillsSectionRef.nativeElement]);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  filterSkills(category: SkillFilter): void {
    if (this.selectedCategory === category) return;

    if (!this.isBrowser || !this.skillsGridRef?.nativeElement) {
      this.applyFilter(category);
      return;
    }

    this.animationService.animateSkillsFilterOut(this.skillsGridRef.nativeElement, () => {
      this.applyFilter(category);
      setTimeout(() => {
        const cards = this.skillCardRefs.map(ref => ref.nativeElement);
        this.animationService.animateSkillsFilterIn(cards);
      }, 0);
    });
  }

  onIconError(skillName: string): void {
    this.missingIcons.add(skillName);
    this.cdr.markForCheck();
  }

  hasIconError(skillName: string): boolean {
    return this.missingIcons.has(skillName);
  }

  getInitials(name: string): string {
    return name
      .split(/[\s.-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  private applyFilter(category: SkillFilter): void {
    this.selectedCategory = category;
    this.visibleSkills = this.getFilteredSkills(category);
    this.cdr.markForCheck();
  }

  private getFilteredSkills(category: SkillFilter): Skill[] {
    if (category === 'all') return [...this.skills];
    return this.skills.filter(skill => skill.category === category);
  }

  private animateSection(): void {
    const headerEls = this.headerItemRefs.map(ref => ref.nativeElement);
    const filterEls = this.filterItemRefs.map(ref => ref.nativeElement);
    const cardEls = this.skillCardRefs.map(ref => ref.nativeElement);
    const triggerEl = this.skillsSectionRef?.nativeElement;

    if (!triggerEl) return;

    this.animationService.animateSkillsSection(headerEls, filterEls, cardEls, triggerEl);
  }
}
