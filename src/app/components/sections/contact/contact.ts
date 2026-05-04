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
import { Contact } from '../../../models/contact.model';
import { AnimationService } from '../../../services/animation';
import { AppStateService } from '../../../services/app-state';
import { ContactService } from '../../../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  contact?: Contact;
  isCopied = false;

  @ViewChild('contactSection') contactSectionRef!: ElementRef<HTMLElement>;
  @ViewChildren('introItem') introItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('detailItem') detailItemRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('socialItem') socialItemRefs!: QueryList<ElementRef<HTMLElement>>;

  private copiedTimeoutId?: ReturnType<typeof setTimeout>;
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private appStateService: AppStateService,
    private cdr: ChangeDetectorRef,
    private contactService: ContactService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.contactService.getContact()
      .pipe(takeUntil(this.destroy$))
      .subscribe(contact => {
        this.contact = contact;
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
    if (this.copiedTimeoutId) {
      clearTimeout(this.copiedTimeoutId);
    }

    if (this.isBrowser && this.contactSectionRef?.nativeElement) {
      this.animationService.killScrollTriggersFor([this.contactSectionRef.nativeElement]);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  sendEmail(): void {
    this.contactService.sendEmail();
  }

  async copyEmail(): Promise<void> {
    const copied = await this.contactService.copyEmail();
    if (!copied) return;

    this.isCopied = true;
    this.cdr.markForCheck();

    if (this.copiedTimeoutId) {
      clearTimeout(this.copiedTimeoutId);
    }

    this.copiedTimeoutId = setTimeout(() => {
      this.isCopied = false;
      this.cdr.markForCheck();
    }, 2000);
  }

  private animateSection(): void {
    const introEls = this.introItemRefs.map(ref => ref.nativeElement);
    const detailEls = this.detailItemRefs.map(ref => ref.nativeElement);
    const socialEls = this.socialItemRefs.map(ref => ref.nativeElement);
    const triggerEl = this.contactSectionRef?.nativeElement;

    if (!triggerEl) return;

    this.animationService.animateContactSection(introEls, detailEls, socialEls, triggerEl);
  }
}
