import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AnimationService } from '../../../services/animation';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  currentYear = new Date().getFullYear();
  repoUrl = 'https://github.com/';

  @ViewChild('footer') footerRef!: ElementRef<HTMLElement>;

  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.animationService.animateFooterIn(this.footerRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser || !this.footerRef?.nativeElement) return;
    this.animationService.killTriggersForElement(this.footerRef.nativeElement);
  }
}
