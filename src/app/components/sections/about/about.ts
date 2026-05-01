import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { About } from '../../../models/about.model';
import { AboutService } from '../../../services/about.service';
import { AnimationService } from '../../../services/animation';
import { AppStateService } from '../../../services/app-state';
import { ScrollSpyService } from '../../../services/scroll-spy';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  about$!: Observable<About>;

  @ViewChild('aboutSection') aboutSectionRef!: ElementRef<HTMLElement>;
  @ViewChildren('introItem') introItemRefs!: QueryList<ElementRef<HTMLElement>>;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private aboutService: AboutService,
    private animationService: AnimationService,
    private appStateService: AppStateService,
    private scrollSpyService: ScrollSpyService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.about$ = this.aboutService.getAbout();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.appStateService.preloaderComplete$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => this.animateIntro());

    this.animationService.animateAboutOnScroll(this.aboutSectionRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToProjects(): void {
    this.scrollSpyService.scrollToSection('projects');
  }

  private animateIntro(): void {
    const elements = this.introItemRefs.map(ref => ref.nativeElement);
    this.animationService.animateAboutIntro(elements);
  }
}
